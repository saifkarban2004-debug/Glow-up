import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-charcoal text-cream font-body pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="space-y-4">
            <h3 className="font-heading text-2xl uppercase tracking-widest text-rose-gold mb-6">Glow Up</h3>
            <p className="text-cream/70 text-sm leading-relaxed">
              Curating the finest luxury cosmetics designed to elevate your natural beauty. Experience the art of self-care.
            </p>
          </div>
          
          <div>
            <h4 className="font-heading uppercase tracking-wider text-sm mb-6 text-white">Shop</h4>
            <ul className="space-y-4 text-cream/70 text-sm">
              <li><Link href="/category/skincare" className="hover:text-rose-gold transition-colors">Skincare</Link></li>
              <li><Link href="/category/makeup" className="hover:text-rose-gold transition-colors">Makeup</Link></li>
              <li><Link href="/category/fragrance" className="hover:text-rose-gold transition-colors">Fragrance</Link></li>
              <li><Link href="/category/accessories" className="hover:text-rose-gold transition-colors">Accessories</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading uppercase tracking-wider text-sm mb-6 text-white">Support</h4>
            <ul className="space-y-4 text-cream/70 text-sm">
              <li><Link href="/faq" className="hover:text-rose-gold transition-colors">FAQ</Link></li>
              <li><Link href="/shipping" className="hover:text-rose-gold transition-colors">Shipping & Returns</Link></li>
              <li><Link href="/contact" className="hover:text-rose-gold transition-colors">Contact Us</Link></li>
              <li><Link href="/track" className="hover:text-rose-gold transition-colors">Track Order</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading uppercase tracking-wider text-sm mb-6 text-white">Newsletter</h4>
            <p className="text-cream/70 text-sm mb-4">
              Subscribe to receive exclusive offers and beauty tips.
            </p>
            <form className="flex flex-col space-y-4">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-transparent border-b border-cream/30 pb-2 text-cream focus:outline-none focus:border-rose-gold transition-colors placeholder:text-cream/50 text-sm"
                required
              />
              <button 
                type="submit" 
                className="text-left text-rose-gold uppercase tracking-widest text-xs hover:text-white transition-colors pt-2"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-cream/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-cream/50">
          <p>&copy; {new Date().getFullYear()} Glow Up Cosmetics. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-cream transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-cream transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
