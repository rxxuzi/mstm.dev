'use client';
import './tools.css';
import { useState, useRef, useEffect } from 'react';
import { Download, Copy, Play } from 'lucide-react';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';

export default function WebPy() {
    const [code, setCode] = useState(`# web.py - Python in Browser
print("Hello, World!")

def fibonacci(n):
    if n <= 0:
        return []
    elif n == 1:
        return [0]
    else:
        fib = [0, 1]
        for i in range(2, n):
            fib.append(fib[-1] + fib[-2])
        return fib

result = fibonacci(10)
print(f"Fibonacci: {result}")`);

    const [output, setOutput] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isRunning, setIsRunning] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pyodideRef = useRef<any>(null);

    useEffect(() => {
        loadPyodide();
    }, []);

    const loadPyodide = async () => {
        try {
            setLoadingProgress(20);
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
            script.async = true;
            document.head.appendChild(script);

            script.onload = async () => {
                setLoadingProgress(60);
                // @ts-expect-error - Pyodide is loaded from CDN
                pyodideRef.current = await window.loadPyodide({
                    indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/'
                });
                setLoadingProgress(100);
                setIsLoading(false);
                setOutput('// Ready to execute Python code');
            };
        } catch (error) {
            console.error('Failed to load Pyodide:', error);
            setOutput('// Failed to load Python environment');
            setIsLoading(false);
        }
    };

    const runCode = async () => {
        if (!pyodideRef.current || isRunning) return;

        setIsRunning(true);
        setOutput('// Executing...');

        try {
            pyodideRef.current.runPython(`
                import sys
                from io import StringIO
                sys.stdout = StringIO()
            `);

            await pyodideRef.current.runPythonAsync(code);
            const stdout = pyodideRef.current.runPython('sys.stdout.getvalue()');
            setOutput(stdout || '// No output');
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            setOutput(`// ERROR\n${message}`);
        } finally {
            setIsRunning(false);
        }
    };

    const exportCode = () => {
        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'web.py';
        a.click();
        URL.revokeObjectURL(url);
    };

    if (isLoading) {
        return (
            <div className="tool-container" style={{ background: '#000', color: '#fff' }}>
                <div className="tool-loading">
                    <div className="tool-spinner" style={{ borderColor: '#333', borderTopColor: '#33ccdd' }} />
                    <div>
                        <div className="tool-loading-text">Loading Python Runtime</div>
                        <div className="tool-loading-subtext">Downloading Pyodide...</div>
                    </div>
                    <div className="tool-progress-container">
                        <div className="tool-progress-bar">
                            <div className="tool-progress-fill" style={{ width: `${loadingProgress}%`, background: '#33ccdd' }} />
                        </div>
                        <div style={{ textAlign: 'center', fontSize: '0.75rem', opacity: 0.4, marginTop: 'var(--space-sm)' }}>
                            {loadingProgress}%
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: '#000', color: '#fff', display: 'flex', flexDirection: 'column' }}>
            <header style={{
                padding: '1rem 1.5rem',
                borderBottom: '1px solid #222',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <h1 style={{ fontSize: '1rem', fontWeight: '600', margin: 0, fontFamily: 'var(--font-geist-mono)' }}>
                    web.py
                </h1>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                        onClick={exportCode}
                        style={{
                            background: 'transparent',
                            border: '1px solid #333',
                            borderRadius: '6px',
                            padding: '0.4rem 0.6rem',
                            color: '#fff',
                            cursor: 'pointer'
                        }}
                    >
                        <Download size={14} />
                    </button>
                    <button
                        onClick={runCode}
                        disabled={isRunning}
                        style={{
                            background: '#33ccdd',
                            color: '#000',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '0.4rem 0.8rem',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            cursor: isRunning ? 'not-allowed' : 'pointer',
                            opacity: isRunning ? 0.5 : 1,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem'
                        }}
                    >
                        <Play size={14} fill="currentColor" />
                        {isRunning ? 'Running' : 'Run'}
                    </button>
                </div>
            </header>

            <div style={{ flex: 1, display: 'flex', height: 'calc(100vh - 100px)' }}>
                {/* Editor */}
                <div style={{ flex: 1, borderRight: '1px solid #222', display: 'flex', flexDirection: 'column' }}>
                    <div style={{
                        padding: '0.5rem 1rem',
                        borderBottom: '1px solid #222',
                        fontSize: '0.65rem',
                        fontWeight: '600',
                        opacity: 0.4,
                        textTransform: 'uppercase'
                    }}>
                        Input <span style={{ float: 'right', fontWeight: '400' }}>Cmd+Enter to run</span>
                    </div>
                    <CodeMirror
                        value={code}
                        onChange={(value) => setCode(value)}
                        extensions={[python()]}
                        theme="dark"
                        height="100%"
                        basicSetup={{
                            lineNumbers: true,
                            highlightActiveLineGutter: true,
                            highlightActiveLine: true,
                            foldGutter: true,
                            autocompletion: true,
                            indentOnInput: true,
                        }}
                        style={{
                            fontSize: '14px',
                            fontFamily: 'var(--font-geist-mono)',
                            height: '100%'
                        }}
                    />
                </div>

                {/* Output */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{
                        padding: '0.5rem 1rem',
                        borderBottom: '1px solid #222',
                        fontSize: '0.65rem',
                        fontWeight: '600',
                        opacity: 0.4,
                        textTransform: 'uppercase',
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}>
                        <span>Output</span>
                        {output && (
                            <button
                                onClick={() => navigator.clipboard.writeText(output)}
                                style={{
                                    background: 'transparent',
                                    border: '1px solid #333',
                                    borderRadius: '4px',
                                    padding: '0.2rem 0.4rem',
                                    color: '#fff',
                                    cursor: 'pointer',
                                    fontSize: '0.65rem'
                                }}
                            >
                                <Copy size={10} />
                            </button>
                        )}
                    </div>
                    <div style={{
                        flex: 1,
                        padding: '1rem',
                        overflowY: 'auto',
                        background: '#0a0a0a'
                    }}>
                        <pre style={{
                            margin: 0,
                            fontSize: '0.8rem',
                            fontFamily: 'var(--font-geist-mono)',
                            lineHeight: '1.5',
                            color: output.startsWith('// ERROR') ? '#ef4444' : '#fff'
                        }}>
                            {output || '// Waiting for execution...'}
                        </pre>
                    </div>
                </div>
            </div>

            <footer style={{
                padding: '0.75rem 1.5rem',
                borderTop: '1px solid #222',
                fontSize: '0.65rem',
                opacity: 0.3,
                textAlign: 'center'
            }}>
                Powered by Pyodide â€¢ Â© 2025 mstm.dev
            </footer>
        </div>
    );
}