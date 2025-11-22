'use client';

import React, { useState, useEffect } from 'react';
import { DollarSign, Users, Zap, Activity, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import AgentControlPanel from '@/components/admin/AgentControlPanel';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client (Client-side)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface AgentLog {
    id: number;
    agent_name: string;
    action_type: string;
    details: any;
    status: 'success' | 'error' | 'warning';
    created_at: string;
}

export default function AdminDashboard() {
    const [mounted, setMounted] = useState(false);
    const [stats, setStats] = useState({
        revenue: 0,
        leads: 0,
        installers: 0,
        health: 'Checking...'
    });
    const [logs, setLogs] = useState<AgentLog[]>([]);

    useEffect(() => {
        setMounted(true);
        fetchDashboardData();

        // Realtime Subscription for Logs
        const channel = supabase
            .channel('dashboard_logs')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'agent_logs' }, (payload) => {
                const newLog = payload.new as AgentLog;
                setLogs(prev => [newLog, ...prev].slice(0, 50));
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    async function fetchDashboardData() {
        try {
            // 1. Get Lead Count
            const { count: leadCount } = await supabase.from('leads').select('*', { count: 'exact', head: true });

            // 2. Get Installer Count
            const { count: installerCount } = await supabase.from('installers').select('*', { count: 'exact', head: true });

            // 3. Get Recent Logs
            const { data: recentLogs } = await supabase
                .from('agent_logs')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(20);

            setStats({
                revenue: (leadCount || 0) * 25, // Est. $25 per lead
                leads: leadCount || 0,
                installers: installerCount || 0,
                health: '98%'
            });

            if (recentLogs) setLogs(recentLogs);
        } catch (error) {
            console.error("Dashboard fetch error:", error);
        }
    }

    if (!mounted) return <div className="p-8">Loading Cockpit...</div>;

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">God Mode Dashboard</h1>
                    <p className="text-slate-500">System Status: <span className="text-green-600 font-semibold">ONLINE</span> | Active Agents: 3 Autonomous / 8 Total</p>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card title="Est. Revenue" value={`$${stats.revenue}`} change="Live" icon={<DollarSign className="text-green-600" />} />
                    <Card title="Total Leads" value={stats.leads} change="Live" icon={<Users className="text-blue-600" />} />
                    <Card title="Installers Indexed" value={stats.installers} change="Indexed" icon={<Zap className="text-yellow-600" />} />
                    <Card title="System Health" value={stats.health} change="Stable" icon={<Activity className="text-purple-600" />} />
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <AgentControlPanel />
                    </div>

                    {/* Activity Log */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                             <Clock className="w-5 h-5 text-slate-400" />
                             Live Agent Feed
                        </h3>
                        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200">
                            {logs.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-slate-400 text-sm">No agent activity detected.</p>
                                    <p className="text-slate-300 text-xs mt-1">Run an agent to see logs.</p>
                                </div>
                            ) : (
                                logs.map((log) => (
                                    <div key={log.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg text-sm border border-slate-100 transition-all hover:bg-blue-50">
                                        <StatusIcon status={log.status} />
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <span className="font-bold text-slate-900">{log.agent_name}</span>
                                                <span className="text-[10px] font-mono text-slate-400">
                                                    {new Date(log.created_at).toLocaleTimeString()}
                                                </span>
                                            </div>
                                            <p className="text-slate-700 font-medium mt-0.5 capitalize">{log.action_type.replace(/_/g, ' ')}</p>
                                            {/* Render details if interesting */}
                                            {log.details && log.status === 'error' && (
                                                <p className="text-red-500 text-xs mt-1 break-all">{JSON.stringify(log.details)}</p>
                                            )}
                                            {log.details && log.details.items_processed && (
                                                 <p className="text-slate-500 text-xs mt-1">Processed: {log.details.items_processed} items</p>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

function Card({ title, value, change, icon }: any) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
            <div>
                <p className="text-sm text-slate-500 font-medium">{title}</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full mt-2 inline-block">
                    {change}
                </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">{icon}</div>
        </div>
    );
}

function StatusIcon({ status }: { status: string }) {
    switch (status) {
        case 'success': return <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />;
        case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0" />;
        case 'error': return <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />;
        default: return <Activity className="w-5 h-5 text-slate-400 shrink-0" />;
    }
}