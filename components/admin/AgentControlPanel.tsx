'use client';

import { useState } from 'react';
import { Play, Activity, CheckCircle, AlertCircle } from 'lucide-react';

interface Agent {
    id: string;
    name: string;
    role: string;
    model: string;
    status: 'idle' | 'running' | 'success' | 'error';
    lastRun?: string;
    endpoint?: string; // Added endpoint mapping
}

export default function AgentControlPanel() {
    const [agents, setAgents] = useState<Agent[]>([
        { id: 'promoter', name: 'The Promoter', role: 'Outreach & Marketing', model: 'DeepSeek-V3', status: 'idle', endpoint: '/api/cron/promoter' },
        { id: 'auditor', name: 'The Auditor', role: 'QA & SEO', model: 'Gemini 2.0 Flash', status: 'idle', endpoint: '/api/cron/auditor' },
        { id: 'operator', name: 'The Operator', role: 'Data Integrity', model: 'DeepSeek-R1', status: 'idle', endpoint: '/api/cron/operator' },
        { id: 'google-places', name: 'Google Places', role: 'Real Data Fetcher', model: 'Google Places API', status: 'idle', endpoint: '/api/cron/google-places' },
        // Placeholders for others not yet migrated to Cron
        { id: 'strategist', name: 'The Strategist', role: 'Content Creator', model: 'Gemini 2.0 Flash', status: 'idle' },
        { id: 'overseer', name: 'The Overseer', role: 'Project Manager', model: 'Claude 3.5 Sonnet', status: 'idle' },
    ]);

    const [apiKey, setApiKey] = useState('');

    const runAgent = async (agent: Agent) => {
        if (!agent.endpoint) {
            alert('This agent has not been migrated to the Autonomous Swarm yet.');
            return;
        }

        if (!apiKey) {
            alert('Please enter the CRON_SECRET to execute agents.');
            return;
        }

        setAgents(prev => prev.map(a => a.id === agent.id ? { ...a, status: 'running' } : a));

        try {
            const res = await fetch(agent.endpoint, {
                method: 'GET', // Crons are GET
                headers: { 
                    'Authorization': `Bearer ${apiKey}`
                }
            });

            if (!res.ok) {
                throw new Error(`Status ${res.status}`);
            }

            setAgents(prev => prev.map(a => a.id === agent.id ? { ...a, status: 'success', lastRun: new Date().toLocaleTimeString() } : a));
        } catch (error) {
            console.error(error);
            alert(`Execution Failed: ${error}`);
            setAgents(prev => prev.map(a => a.id === agent.id ? { ...a, status: 'error' } : a));
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                Agent Control Panel
            </h2>
            <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">CRON Secret Key</label>
                <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter CRON_SECRET to enable execution"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            <div className="space-y-4">
                {agents.map((agent) => (
                    <div key={agent.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                        <div>
                            <h3 className="font-semibold text-slate-900">{agent.name}</h3>
                            <p className="text-sm text-slate-500">{agent.role} • {agent.model}</p>
                            {agent.lastRun && <p className="text-xs text-slate-400 mt-1">Last run: {agent.lastRun}</p>}
                        </div>
                        <div className="flex items-center gap-3">
                            {agent.status === 'running' && <span className="text-blue-600 text-sm animate-pulse">Running...</span>}
                            {agent.status === 'success' && <CheckCircle className="w-5 h-5 text-green-500" />}
                            {agent.status === 'error' && <AlertCircle className="w-5 h-5 text-red-500" />}

                            <button
                                onClick={() => runAgent(agent)}
                                disabled={agent.status === 'running' || !agent.endpoint}
                                className="p-2 bg-white border border-slate-200 rounded-full hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                title={agent.endpoint ? `Run ${agent.name}` : "Agent not active"}
                            >
                                <Play className="w-4 h-4 fill-current" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}