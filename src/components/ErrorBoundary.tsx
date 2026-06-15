import { Component, type ErrorInfo, type ReactNode } from "react";
import { RotateCcw } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <main className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4">
          <div className="max-w-md text-center">
            <div className="font-mono text-[10px] uppercase tracking-widest text-neon-red">
              Erro inesperado
            </div>
            <h1 className="mt-2 font-display text-2xl font-bold text-foreground">
              Algo deu errado
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {this.state.error?.message ?? "Ocorreu um erro ao renderizar a página."}
            </p>
            <button
              onClick={this.handleReset}
              className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full border border-neon-cyan/40 px-5 py-2.5 text-sm font-medium text-neon-cyan transition hover:bg-neon-cyan/10"
            >
              <RotateCcw size={14} />
              Tentar novamente
            </button>
          </div>
        </main>
      );
    }
    return this.props.children;
  }
}
