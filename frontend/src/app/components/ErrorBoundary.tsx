import React from 'react';
import { Home, RefreshCw, AlertTriangle } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo });
    // Log lỗi để debug
    console.error('[ErrorBoundary] Component crash:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50 flex items-center justify-center px-4">
          <div className="text-center max-w-md w-full">
            {/* Icon */}
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={40} className="text-red-600" />
            </div>

            <h1 className="text-2xl font-bold text-gray-800 mb-3">
              Đã xảy ra lỗi
            </h1>
            <p className="text-gray-500 mb-2 leading-relaxed">
              Trang này gặp sự cố không mong muốn. Vui lòng thử lại hoặc quay về trang chủ.
            </p>

            {/* Error detail (chỉ hiện khi dev) */}
            {import.meta.env.DEV && this.state.error && (
              <details className="mb-6 text-left bg-red-50 border border-red-200 rounded-lg p-4 text-xs text-red-800 font-mono">
                <summary className="cursor-pointer font-semibold mb-2 text-sm">
                  Chi tiết lỗi (chỉ hiển thị khi dev)
                </summary>
                <p className="break-all">{this.state.error.message}</p>
                {this.state.error.stack && (
                  <pre className="mt-2 overflow-auto max-h-40 whitespace-pre-wrap">
                    {this.state.error.stack}
                  </pre>
                )}
              </details>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
              <button
                onClick={this.handleReset}
                className="inline-flex items-center gap-2 px-6 py-3 bg-red-800 text-white rounded-xl font-semibold hover:bg-red-900 transition-all shadow-lg"
              >
                <RefreshCw size={18} />
                Thử lại
              </button>
              <a
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition-all shadow-sm"
              >
                <Home size={18} />
                Về Trang Chủ
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
