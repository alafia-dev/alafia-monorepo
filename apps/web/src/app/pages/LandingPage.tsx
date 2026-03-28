import { Link } from "react-router-dom";
import { Shield, Share2, Activity, Users } from "lucide-react";
import ImageWithFallback from "../components/figma/ImageWithFallback";
import logo from "../img/logo4.png";
import person1 from "../img/person1.webp";
import person2 from "../img/person2.webp";
import person3 from "../img/person3.jpg";
import dashHero from "../img/dash2.jpg";
export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              {/* <Activity className="w-6 h-6 text-primary-foreground" /> */}
              <img
                src={logo}
                alt="Alafia Logo"
                className="w-10 h-10 rounded-lg object-cover"
              />
            </div>
            <span className="text-2xl font-semibold text-foreground">
              Alafia
            </span>
          </div>
          <Link
            to="/login"
            className="px-6 py-2 bg-transparent text-primary rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors shadow-md"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-10 md:py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-6">
              Your Health. Your Records. Your Rules,
              <br />
              {/*<span className="text-primary">Your Control</span>*/}
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Alafia is a patient-owned Electronic Medical Record platform built
              on Web5 principles. Control your health records with decentralized
              identity and share access securely with healthcare providers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/register"
                className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-center shadow-md"
              >
                Create Health Wallet
              </Link>
              <Link
                to="/dashboard"
                className="px-8 py-3 bg-muted text-foreground rounded-lg hover:bg-muted/90 transition-colors text-center shadow-sm"
              >
                Learn More
              </Link>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-2xl w-full md:w-[600px] h-[400px] md:h-[400px]">
            <ImageWithFallback
              src={dashHero}
              fallback={dashHero}
              alt="Modern healthcare"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-card py-10 shadow-lg">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-semibold text-center text-foreground mb-12">
            Patient Data Ownership.
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
            <div className="p-8 bg-background rounded-xl shadow-md">
              <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Patient Data Ownership
              </h3>
              <p className="text-muted-foreground">
                Your health records belong to you. Store, manage, and control
                access to your medical data using your decentralized identity
                wallet.
              </p>
            </div>

            <div className="p-8 bg-background rounded-xl shadow-md">
              <div className="w-14 h-14 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                <Share2 className="w-7 h-7 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Secure Sharing with Hospitals
              </h3>
              <p className="text-muted-foreground">
                Grant temporary or permanent access to doctors and hospitals.
                Revoke permissions anytime with complete transparency.
              </p>
            </div>

            <div className="p-8 bg-background rounded-xl shadow-md">
              <div className="w-14 h-14 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Hospital, Pharmacy & Lab Integration
              </h3>
              <p className="text-muted-foreground">
                Seamlessly connect with Hospitals, pharmacies for prescriptions
                and diagnostic labs for test results, all in one secure
                platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold text-center text-foreground mb-12">
            How Alafia Works
          </h2>
          <div className="space-y-8">
            <div className="flex gap-6">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0 text-primary-foreground font-semibold">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Create Your Health Wallet
                </h3>
                <p className="text-muted-foreground">
                  Set up your decentralized identity (DID) wallet in minutes.
                  This becomes your secure, portable health record vault.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center flex-shrink-0 text-primary-foreground font-semibold">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Add or Sync Medical Records
                </h3>
                <p className="text-muted-foreground">
                  Upload existing records or connect with healthcare providers
                  to automatically sync your medical history, prescriptions, and
                  lab results.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center flex-shrink-0 text-primary-foreground font-semibold">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Grant Access, Revoke Anytime
                </h3>
                <p className="text-muted-foreground">
                  Grant specific healthcare providers access to your records for
                  a defined period. Monitor who views your data and revoke
                  access anytime.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6">
            Take Control of Your Health Data Today
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Join thousands of patients who trust Alafia for secure,
            decentralized health record management.
          </p>
          <Link
            to="/dashboard"
            className="inline-block px-8 py-3 bg-card text-primary rounded-lg hover:bg-card/90 transition-colors"
          >
            Your Records, Your Way — Sign Up Now.
          </Link>
        </div>
      </section>
      {/* Patient Testimonials Section */}
      <section className="bg-card py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-semibold text-center text-foreground mb-12">
            What Our Patients Say
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="p-8 bg-background rounded-xl shadow-md flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full overflow-hidden mb-4">
                <img
                  src={person1}
                  alt="Patient Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-muted-foreground mb-4">
                “Finally, I know exactly who can see my health records — total
                peace of mind.”
              </p>
              <h4 className="font-semibold text-foreground">Chinwe, Lagos</h4>
            </div>

            {/* Testimonial 2 */}
            <div className="p-8 bg-background rounded-xl shadow-md flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full overflow-hidden mb-4">
                <img
                  src={person2}
                  alt="Patient Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-muted-foreground mb-4">
                “No more paper forms or repeated tests. Alafia saves time and
                money.”
              </p>
              <h4 className="font-semibold text-foreground">Emeka, Abuja</h4>
            </div>

            {/* Testimonial 3 */}
            <div className="p-8 bg-background rounded-xl shadow-md flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full overflow-hidden mb-4">
                <img
                  src={person3}
                  alt="Patient Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-muted-foreground mb-4">
                “I can instantly send lab results to my pharmacy — seamless
                care!”
              </p>
              <h4 className="font-semibold text-foreground">Fatima, Kano</h4>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-semibold text-foreground">
                  Alafia
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your Health. Your Records. Your Rules
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Features</li>
                <li>Security</li>
                <li>Pricing</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>About</li>
                <li>Blog</li>
                <li>Careers</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Privacy</li>
                <li>Terms</li>
                <li>HIPAA Compliance</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2026 Alafia. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
