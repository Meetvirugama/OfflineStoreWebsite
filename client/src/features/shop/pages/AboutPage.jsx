import { ShieldCheck, TrendingUp, Users, HeartHandshake, Leaf, Cpu } from "lucide-react";

export default function AboutPage() {
  const VALUES = [
    {
      icon: <Leaf size={32} className="text-emerald-500" />,
      title: "Sustainable Growth",
      desc: "Promoting farming methods that protect the soil for the next seven generations while maximizing yield."
    },
    {
      icon: <Cpu size={32} className="text-emerald-500" />,
      title: "AI-Powered Intelligence",
      desc: "Bringing world-class predictive analytics to the smallest farm plots in rural India."
    },
    {
      icon: <HeartHandshake size={32} className="text-emerald-500" />,
      title: "Direct Commitment",
      desc: "Eliminating predatory middlemen to ensure farmers get the full value of their labor and crops."
    }
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section style={{ 
        background: 'linear-gradient(rgba(5, 150, 105, 0.8), rgba(6, 78, 59, 0.9)), url("https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '120px 20px',
        textAlign: 'center',
        color: '#fff'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '20px' }}>Cultivating the Future</h1>
          <p style={{ fontSize: '1.25rem', opacity: 0.9, lineHeight: 1.6 }}>
            AgroMart is not just an ERP; it's a movement to digitize and empower the backbone of our nation using local intelligence and global technology.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section style={{ padding: '80px 20px', background: '#fff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '60px', alignItems: 'center' }}>
          <div>
            <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '24px' }}>Our Mission</h2>
            <p style={{ fontSize: '1.1rem', color: '#4b5563', lineHeight: 1.8, marginBottom: '20px' }}>
              For decades, farmers have operated in the dark, subject to the whims of weather and volatile markets. We started AgroMart with a simple belief: a grain farmer in an Indian village deserves the same cutting-edge technology as any modern enterprise.
            </p>
            <p style={{ fontSize: '1.1rem', color: '#4b5563', lineHeight: 1.8 }}>
              We are building the "Operating System for Farming" in Gujarat and beyond—integrating supply chains, providing AI-driven crop advisory, and creating a transparent marketplace for agricultural success.
            </p>
          </div>
          <div style={{ position: 'relative' }}>
             <img 
               src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=800&q=80" 
               alt="Farming Innovation" 
               style={{ width: '100%', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)' }}
             />
             <div className="card-premium" style={{ position: 'absolute', bottom: '-20px', left: '20px', padding: '20px', background: '#fff', maxWidth: '200px' }}>
                <TrendingUp className="text-emerald-500" style={{ marginBottom: '10px' }} />
                <h4 style={{ margin: 0 }}>40% Yield Increase</h4>
                <p style={{ fontSize: '0.8rem', opacity: 0.7, margin: 0 }}>On average for our users</p>
             </div>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section style={{ padding: '80px 20px', background: '#f8fafc' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 className="section-title">Core Philosophies</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginTop: '50px' }}>
            {VALUES.map((v, i) => (
              <div key={i} className="card-premium" style={{ height: '100%', padding: '40px', background: '#fff' }}>
                <div style={{ marginBottom: '20px' }}>{v.icon}</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '15px' }}>{v.title}</h3>
                <p style={{ color: '#64748b', lineHeight: 1.6 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commitment Footer */}
      <section style={{ padding: '100px 20px', textAlign: 'center', background: '#059669', color: '#fff' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <Users size={48} style={{ marginBottom: '24px', opacity: 0.8 }} />
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '24px' }}>Growing Together</h2>
          <p style={{ fontSize: '1.15rem', opacity: 0.9, marginBottom: '40px' }}>
            Every interaction on our platform is built on trust and a shared vision of a prosperous, digital agricultural future.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
             <ShieldCheck size={32} />
             <span style={{ fontSize: '1.25rem', fontWeight: 600 }}>Verified Excellence</span>
          </div>
        </div>
      </section>
    </div>
  );
}
