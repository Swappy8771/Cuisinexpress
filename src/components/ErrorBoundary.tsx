import { Component } from 'react'
import type { ReactNode, ErrorInfo } from 'react'

interface Props { children: ReactNode }
interface State { error: Error | null }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-cx-page flex flex-col items-center justify-center gap-4 px-6">
          <p className="text-[18px] font-bold text-cx-base">Une erreur est survenue.</p>
          <pre className="text-[12px] text-red-400 bg-cx-card border border-cx-line rounded-xl p-4 max-w-xl w-full overflow-auto">
            {this.state.error.message}
          </pre>
          <button
            type="button"
            onClick={() => this.setState({ error: null })}
            className="px-5 py-2.5 bg-[#C41E3A] text-white text-[14px] font-semibold rounded-full
              hover:bg-[#a01830] transition-colors"
          >
            Réessayer
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
