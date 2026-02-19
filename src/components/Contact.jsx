import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Linkedin, Github, Send } from 'lucide-react';

const RAW_WEBHOOK_URL = import.meta.env.VITE_CONTACT_WEBHOOK_URL || '';
const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || '';
const WEBHOOK_URL = normalizeWebhookUrl(RAW_WEBHOOK_URL);

const initialForm = {
  name: '',
  email: '',
  message: '',
  website: ''
};

const Contact = ({ isLoading = false }) => {
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [turnstileToken, setTurnstileToken] = useState('');
  const [turnstileReady, setTurnstileReady] = useState(false);
  const [turnstileError, setTurnstileError] = useState('');
  const mountedAtRef = useRef(Date.now());
  const turnstileContainerRef = useRef(null);
  const turnstileWidgetIdRef = useRef(null);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!TURNSTILE_SITE_KEY) {
      setTurnstileReady(false);
      setTurnstileError('Captcha site key is missing.');
      return;
    }

    let cancelled = false;
    let retries = 0;

    const renderWidget = () => {
      if (cancelled) return;
      if (!turnstileContainerRef.current) {
        if (retries < 40) {
          retries += 1;
          window.setTimeout(renderWidget, 100);
        } else {
          setTurnstileError('Captcha container not ready. Refresh and try again.');
        }
        return;
      }
      if (!window.turnstile || typeof window.turnstile.render !== 'function') {
        if (retries < 40) {
          retries += 1;
          window.setTimeout(renderWidget, 100);
          return;
        }
        setTurnstileError('Captcha failed to load. Refresh and try again.');
        return;
      }
      if (turnstileWidgetIdRef.current !== null) return;

      try {
        turnstileWidgetIdRef.current = window.turnstile.render(turnstileContainerRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          theme: 'dark',
          callback: (token) => {
            setTurnstileError('');
            setTurnstileToken(token || '');
            setTurnstileReady(Boolean(token));
          },
          'expired-callback': () => {
            setTurnstileToken('');
            setTurnstileReady(false);
          },
          'error-callback': () => {
            setTurnstileToken('');
            setTurnstileReady(false);
            setTurnstileError('Captcha failed. Please retry.');
          }
        });
      } catch (error) {
        console.error('Turnstile render error:', error);
        setTurnstileError('Captcha failed to initialize. Refresh and try again.');
      }
    };

    const existingScript = document.querySelector('script[data-turnstile-script="true"]');
    if (window.turnstile) {
      renderWidget();
    } else {
      const onScriptReady = () => renderWidget();
      if (existingScript) {
        existingScript.addEventListener('load', onScriptReady);
      } else {
        const script = document.createElement('script');
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        script.async = true;
        script.defer = true;
        script.dataset.turnstileScript = 'true';
        script.onload = onScriptReady;
        script.onerror = () => setTurnstileError('Captcha script failed to load.');
        document.head.appendChild(script);
      }
    }

    return () => {
      cancelled = true;
      if (window.turnstile && turnstileWidgetIdRef.current !== null) {
        window.turnstile.remove(turnstileWidgetIdRef.current);
        turnstileWidgetIdRef.current = null;
      }
    };
  }, [TURNSTILE_SITE_KEY, isLoading]);

  const onChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const validate = () => {
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      return 'Please fill all fields before sending.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim())) {
      return 'Please enter a valid email address.';
    }

    if (form.message.trim().length < 10) {
      return 'Message should be at least 10 characters.';
    }

    if (!TURNSTILE_SITE_KEY) {
      return 'Captcha is not configured. Set VITE_TURNSTILE_SITE_KEY.';
    }

    if (turnstileError) {
      return turnstileError;
    }

    if (!turnstileToken || !turnstileReady) {
      return 'Please complete the captcha challenge.';
    }

    return '';
  };

  const resetTurnstile = () => {
    if (window.turnstile && turnstileWidgetIdRef.current !== null) {
      window.turnstile.reset(turnstileWidgetIdRef.current);
    }
    setTurnstileToken('');
    setTurnstileReady(false);
  };

  const submitForm = async (event) => {
    event.preventDefault();
    setStatus({ type: '', message: '' });

    if (!WEBHOOK_URL) {
      setStatus({
        type: 'error',
        message: 'Contact service is not configured yet. Set VITE_CONTACT_WEBHOOK_URL.'
      });
      return;
    }

    const validationError = validate();
    if (validationError) {
      setStatus({ type: 'error', message: validationError });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          message: form.message.trim(),
          website: form.website,
          turnstileToken,
          dwellMs: Date.now() - mountedAtRef.current,
          source: 'portfolio-contact-form',
          submittedAt: new Date().toISOString()
        })
      });

      if (!response.ok) {
        const details = await response.text();
        throw new Error(`Request failed with status ${response.status}: ${details}`);
      }

      setForm(initialForm);
      setStatus({ type: 'success', message: 'Transmission sent successfully.' });
      resetTurnstile();
    } catch (error) {
      console.error('Contact form submit failed:', error);
      setStatus({ type: 'error', message: 'Failed to send transmission. Please try again.' });
      resetTurnstile();
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusClass = status.type === 'error' ? 'text-rose-400' : 'text-emerald-400';

  if (isLoading) {
    return (
      <section id="contact" className="py-24 bg-slate-900 relative">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <div className="skeleton-line h-10 w-72 mx-auto mb-5"></div>
            <div className="skeleton-line h-5 w-96 max-w-full mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              {[0, 1, 2].map((item) => (
                <div key={item} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full skeleton-line"></div>
                  <div className="flex-1">
                    <div className="skeleton-line h-3 w-24 mb-2"></div>
                    <div className="skeleton-line h-5 w-48"></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700">
              <div className="skeleton-line h-12 w-full mb-6"></div>
              <div className="skeleton-line h-12 w-full mb-6"></div>
              <div className="skeleton-line h-32 w-full mb-6"></div>
              <div className="skeleton-line h-16 w-full mb-6"></div>
              <div className="skeleton-line h-12 w-full rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-24 bg-slate-900 relative">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Initialize <span className="text-cyan-500">Connection</span>
          </h2>
          <p className="text-slate-400 text-lg">
            Ready to build something extraordinary? Let's discuss first principles.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-cyan-400">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <div className="text-slate-500 text-sm font-mono">EMAIL</div>
                <a href="mailto:duggempudireddy1233@gmail.com" className="text-white hover:text-cyan-400 transition-colors">
                  duggempudireddy1233@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-cyan-400">
                <Linkedin className="w-6 h-6" />
              </div>
              <div>
                <div className="text-slate-500 text-sm font-mono">LINKEDIN</div>
                <a href="https://linkedin.com/in/avinash-reddy-6b9b56207" target="_blank" rel="noopener noreferrer" className="text-white hover:text-cyan-400 transition-colors">
                  linkedin.com/in/avinash-reddy...
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-cyan-400">
                <Github className="w-6 h-6" />
              </div>
              <div>
                <div className="text-slate-500 text-sm font-mono">GITHUB</div>
                <a href="https://github.com/THEAVINASHREDDY" target="_blank" rel="noopener noreferrer" className="text-white hover:text-cyan-400 transition-colors">
                  github.com/THEAVINASHREDDY
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700 backdrop-blur-sm"
          >
            <form className="space-y-6" onSubmit={submitForm}>
              <div>
                <label htmlFor="contact-name" className="block text-slate-400 text-sm font-mono mb-2">IDENTITY</label>
                <input
                  id="contact-name"
                  type="text"
                  value={form.name}
                  onChange={onChange('name')}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  placeholder="Name"
                  autoComplete="name"
                  required
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-slate-400 text-sm font-mono mb-2">COORDINATES</label>
                <input
                  id="contact-email"
                  type="email"
                  value={form.email}
                  onChange={onChange('email')}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  placeholder="Email"
                  autoComplete="email"
                  required
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="block text-slate-400 text-sm font-mono mb-2">TRANSMISSION</label>
                <textarea
                  id="contact-message"
                  value={form.message}
                  onChange={onChange('message')}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors h-32 resize-none"
                  placeholder="Message"
                  required
                ></textarea>
              </div>

              <div className="hidden" aria-hidden="true">
                <label htmlFor="contact-website">Website</label>
                <input
                  id="contact-website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={onChange('website')}
                />
              </div>

              <div className="min-h-[70px]">
                <div ref={turnstileContainerRef}></div>
              </div>
              {turnstileError ? (
                <p className="text-xs font-mono text-rose-400">{turnstileError}</p>
              ) : null}

              {status.message ? (
                <p className={`text-sm font-mono ${statusClass}`}>{status.message}</p>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:opacity-60 disabled:cursor-not-allowed text-slate-900 font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                {isSubmitting ? 'Transmitting...' : 'Send Transmission'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

function normalizeWebhookUrl(value) {
  const trimmed = value.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return `https://${trimmed}`;
}
