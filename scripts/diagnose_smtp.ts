import net from 'net';
import tls from 'tls';

const HOST = 'smtp.gmail.com';
const PORTS = [465, 587];

async function testConnection(port: number, useTls: boolean) {
    console.log(`\nTesting connection to ${HOST}:${port} (${useTls ? 'TLS' : 'TCP'})...`);

    return new Promise((resolve) => {
        const socket = useTls
            ? tls.connect(port, HOST, { rejectUnauthorized: false })
            : net.createConnection(port, HOST);

        socket.setTimeout(5000);

        socket.on('connect', () => {
            console.log(`✅ Connected to ${HOST}:${port}`);
            socket.end();
            resolve(true);
        });

        socket.on('secureConnect', () => {
            console.log(`✅ Securely connected to ${HOST}:${port}`);
            socket.end();
            resolve(true);
        });

        socket.on('error', (err) => {
            console.error(`❌ Connection failed to ${HOST}:${port}:`, err.message);
            resolve(false);
        });

        socket.on('timeout', () => {
            console.error(`❌ Connection timed out to ${HOST}:${port}`);
            socket.destroy();
            resolve(false);
        });
    });
}

async function runDiagnostics() {
    console.log('🔍 Starting SMTP Diagnostics...');

    // Test Port 465 (Implicit SSL/TLS)
    await testConnection(465, true);

    // Test Port 587 (STARTTLS - starts as TCP)
    await testConnection(587, false);

    console.log('\nDiagnostics complete.');
}

runDiagnostics();
