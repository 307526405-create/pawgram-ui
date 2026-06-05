import { Component, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-white dark:bg-gray-900 px-6">
          <div className="text-6xl mb-6">🐾</div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
            出了点问题
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 text-center">
            页面遇到了意外错误，请重试
          </p>
          <button
            onClick={this.handleRetry}
            className="px-8 py-3 bg-[#FF8C42] text-white rounded-full text-sm font-medium active:opacity-80 transition-opacity"
          >
            重试
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
