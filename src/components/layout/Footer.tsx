export function Footer() {
  return (
    <footer className="border-t border-schmal-border/50 bg-schmal-darker/50">
      <div className="container-schmal py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-schmal-accent to-schmal-cyan flex items-center justify-center font-mono font-bold text-sm text-schmal-darker">
                S
              </div>
              <span className="text-sm font-bold tracking-wider">SCHMALSTREETBETS</span>
            </div>
            <p className="text-xs text-schmal-muted max-w-sm leading-relaxed font-mono">
              An elite financial intelligence terminal. Every trade is a permanent record.
              Every conviction is logged. The market remembers.
            </p>
            <div className="flex items-center gap-2 mt-4">
              <div className="w-2 h-2 rounded-full bg-schmal-profit animate-pulse" />
              <span className="text-[10px] font-mono text-schmal-muted">SYSTEMS OPERATIONAL</span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-[10px] font-mono font-semibold text-schmal-muted tracking-widest mb-4">
              NAVIGATION
            </h4>
            <div className="flex flex-col gap-2">
              {['Dashboard', 'Market Intel', 'Admin'].map((item) => (
                <span key={item} className="text-xs text-schmal-text hover:text-schmal-accent cursor-pointer transition-colors">
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <h4 className="text-[10px] font-mono font-semibold text-schmal-muted tracking-widest mb-4">
              SYSTEM STATUS
            </h4>
            <div className="flex flex-col gap-2 font-mono text-xs">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-schmal-profit" />
                <span className="text-schmal-text">API</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-schmal-profit" />
                <span className="text-schmal-text">Data Feed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-schmal-profit" />
                <span className="text-schmal-text">Trade Engine</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-schmal-warning" />
                <span className="text-schmal-text">Analytics</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-schmal-border/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] font-mono text-schmal-muted">
            © {new Date().getFullYear()} SCHMALSTREETBETS. NOT FINANCIAL ADVICE. TRADE AT YOUR OWN RISK.
          </p>
          <p className="text-[10px] font-mono text-schmal-muted">
            &quot;THE MARKET REMEMBERS&quot;
          </p>
        </div>
      </div>
    </footer>
  );
}
