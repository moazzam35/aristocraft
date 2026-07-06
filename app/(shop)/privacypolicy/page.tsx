import React from "react";
import Head from "next/head";

const LAST_UPDATED = "June 15, 2026";

interface Section {
  id: string;
  index: string;
  title: string;
  content: React.ReactNode;
}

const sections: Section[] = [
  {
    id: "information-we-collect",
    index: "01",
    title: "Information We Collect",
    content: (
      <>
        <p>
          We collect information you provide directly to us when you create an
          account, place an order, subscribe to our communications, or contact
          our support team. This includes:
        </p>
        <ul>
          <li>
            <strong>Identity Information:</strong> Your full name, email
            address, phone number, and delivery address.
          </li>
          <li>
            <strong>Payment Information:</strong> Credit or debit card details,
            billing address, and transaction history. Payment data is processed
            securely through our PCI-DSS compliant payment partners and is
            never stored on our servers.
          </li>
          <li>
            <strong>Account Preferences:</strong> Saved items, wishlists, room
            configurations, and communication preferences.
          </li>
          <li>
            <strong>Usage Data:</strong> Information about how you interact with
            our website, including pages visited, products viewed, time spent,
            and referring URLs.
          </li>
          <li>
            <strong>Device Information:</strong> IP address, browser type,
            operating system, and device identifiers collected automatically
            when you access our services.
          </li>
        </ul>
        <p>
          We do not collect sensitive personal data such as government
          identification numbers, health information, or biometric data.
        </p>
      </>
    ),
  },
  {
    id: "how-we-use",
    index: "02",
    title: "How We Use Your Information",
    content: (
      <>
        <p>
          The information we collect is used to deliver, improve, and
          personalise your experience with us. Specifically, we use your data
          to:
        </p>
        <ul>
          <li>Process and fulfil your orders, including delivery coordination and order tracking.</li>
          <li>Send transactional communications such as order confirmations, shipping updates, and delivery notifications.</li>
          <li>Respond to your enquiries, returns requests, and after-sales service needs.</li>
          <li>Personalise product recommendations and curate content relevant to your demonstrated interests.</li>
          <li>Send marketing communications where you have given consent or where we have a legitimate interest to do so.</li>
          <li>Analyse usage patterns to improve our website, product catalogue, and overall customer experience.</li>
          <li>Detect, prevent, and address fraudulent transactions and security incidents.</li>
          <li>Comply with legal obligations, including tax reporting and consumer protection regulations.</li>
        </ul>
        <p>
          We will not use your information for purposes materially different
          from those described here without first notifying you and, where
          required, obtaining your consent.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    index: "03",
    title: "Cookies and Tracking Technologies",
    content: (
      <>
        <p>
          We use cookies and similar tracking technologies to operate our
          website, understand how it is used, and deliver a more relevant
          experience. The categories of cookies we use include:
        </p>
        <ul>
          <li>
            <strong>Strictly Necessary Cookies:</strong> Essential for the
            website to function. These enable core features such as page
            navigation, secure login, and shopping cart functionality. They
            cannot be disabled.
          </li>
          <li>
            <strong>Performance Cookies:</strong> Collect anonymised data on
            how visitors use our site — which pages are most visited, error
            messages encountered — to help us improve performance.
          </li>
          <li>
            <strong>Functional Cookies:</strong> Remember your preferences,
            such as language settings, saved items, and previously viewed
            products.
          </li>
          <li>
            <strong>Targeting & Advertising Cookies:</strong> Used to build a
            profile of your interests and display relevant advertising on
            third-party platforms. These are only placed with your explicit
            consent.
          </li>
        </ul>
        <p>
          You may manage or withdraw your cookie preferences at any time via
          the Cookie Settings panel accessible in the footer of our website.
          Disabling certain cookies may affect the functionality of some parts
          of our site.
        </p>
      </>
    ),
  },
  {
    id: "sharing",
    index: "04",
    title: "Sharing of Information",
    content: (
      <>
        <p>
          We do not sell, rent, or trade your personal information to third
          parties for their own marketing purposes. We may share your
          information in the following limited circumstances:
        </p>
        <ul>
          <li>
            <strong>Service Providers:</strong> We share data with trusted
            partners who assist in operating our business, including payment
            processors, logistics companies, fulfilment warehouses, and
            customer service platforms. These parties are contractually bound
            to handle your data only as instructed.
          </li>
          <li>
            <strong>Business Transfers:</strong> In the event of a merger,
            acquisition, or sale of assets, your information may be transferred
            as part of that transaction. We will notify you before this occurs.
          </li>
          <li>
            <strong>Legal Compliance:</strong> We may disclose information when
            required by law, court order, or governmental authority, or when we
            believe disclosure is necessary to protect the rights, safety, or
            property of our company, customers, or others.
          </li>
          <li>
            <strong>With Your Consent:</strong> We may share information with
            third parties when you have given us explicit permission to do so.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "data-security",
    index: "05",
    title: "Data Security",
    content: (
      <>
        <p>
          We take the protection of your personal data seriously and employ
          industry-standard security measures to safeguard it against
          unauthorised access, alteration, disclosure, or destruction.
        </p>
        <p>
          Our security practices include TLS encryption for all data
          transmitted between your browser and our servers, AES-256 encryption
          for sensitive data at rest, strict access controls limiting data
          access to authorised personnel only, and regular security audits and
          penetration testing conducted by independent third parties.
        </p>
        <p>
          While we apply rigorous safeguards, no method of electronic
          transmission or storage is completely secure. We encourage you to use
          a unique, strong password for your account and to notify us
          immediately if you suspect any unauthorised activity.
        </p>
      </>
    ),
  },
  {
    id: "your-rights",
    index: "06",
    title: "Your Rights",
    content: (
      <>
        <p>
          Depending on your jurisdiction, you may have the following rights
          regarding your personal data:
        </p>
        <ul>
          <li>
            <strong>Right of Access:</strong> You may request a copy of the
            personal data we hold about you.
          </li>
          <li>
            <strong>Right to Rectification:</strong> You may ask us to correct
            inaccurate or incomplete data.
          </li>
          <li>
            <strong>Right to Erasure:</strong> You may request deletion of
            your personal data, subject to legal retention obligations.
          </li>
          <li>
            <strong>Right to Restrict Processing:</strong> You may ask us to
            limit how we use your data in certain circumstances.
          </li>
          <li>
            <strong>Right to Data Portability:</strong> You may request your
            data in a structured, machine-readable format.
          </li>
          <li>
            <strong>Right to Object:</strong> You may object to processing
            based on legitimate interests, including direct marketing.
          </li>
          <li>
            <strong>Right to Withdraw Consent:</strong> Where processing is
            based on consent, you may withdraw it at any time without affecting
            prior lawful processing.
          </li>
        </ul>
        <p>
          To exercise any of these rights, please contact our Privacy team
          using the details in the Contact section below. We will respond
          within 30 days. You also have the right to lodge a complaint with
          your local data protection authority.
        </p>
      </>
    ),
  },
  {
    id: "third-party",
    index: "07",
    title: "Third-Party Services",
    content: (
      <>
        <p>
          Our website may contain links to third-party websites, social media
          platforms, or embedded content from external providers. This Privacy
          Policy applies solely to information collected by Maison & Form and
          does not govern the practices of any third-party site or service.
        </p>
        <p>
          We integrate the following categories of third-party services, each
          with their own privacy practices:
        </p>
        <ul>
          <li>
            <strong>Analytics:</strong> We use privacy-respecting analytics
            tools to understand site performance and visitor behaviour.
          </li>
          <li>
            <strong>Payment Processing:</strong> Transactions are handled by
            certified payment processors operating under strict security and
            compliance standards.
          </li>
          <li>
            <strong>Delivery Partners:</strong> Order fulfilment and logistics
            partners receive limited data necessary to complete your delivery.
          </li>
          <li>
            <strong>Customer Support:</strong> Our helpdesk platform may store
            support conversations and contact details to enable ongoing service.
          </li>
        </ul>
        <p>
          We recommend reviewing the privacy policies of any third-party
          services you interact with through our platform.
        </p>
      </>
    ),
  },
  {
    id: "data-retention",
    index: "08",
    title: "Data Retention",
    content: (
      <>
        <p>
          We retain your personal data only for as long as is necessary to
          fulfil the purposes for which it was collected, or as required by
          applicable law.
        </p>
        <p>
          As a general guide, account information and purchase history are
          retained for the duration of your account and for up to seven years
          thereafter to comply with financial and legal obligations. Marketing
          data is retained until you unsubscribe or withdraw consent. Support
          communications are retained for up to three years following resolution.
        </p>
        <p>
          When data is no longer required, it is securely deleted or
          anonymised in accordance with our data disposal procedures.
        </p>
      </>
    ),
  },
  {
    id: "children",
    index: "09",
    title: "Children's Privacy",
    content: (
      <>
        <p>
          Our website and services are intended for individuals aged 18 and
          over. We do not knowingly collect personal data from children under
          the age of 16. If you are a parent or guardian and believe your child
          has provided us with personal information, please contact us
          immediately using the details below and we will take prompt steps to
          remove that information from our systems.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    index: "10",
    title: "Changes to This Policy",
    content: (
      <>
        <p>
          We may update this Privacy Policy from time to time to reflect
          changes in our practices, legal requirements, or the services we
          offer. When we make material changes, we will notify you by email (if
          you have an account with us) and by updating the "Last Updated" date
          at the top of this page.
        </p>
        <p>
          We encourage you to review this Policy periodically. Your continued
          use of our website after any changes become effective constitutes
          your acceptance of the revised Policy.
        </p>
      </>
    ),
  },
  {
    id: "contact",
    index: "11",
    title: "Contact Information",
    content: (
      <>
        <p>
          If you have questions, concerns, or requests regarding this Privacy
          Policy or how we handle your personal data, please contact our
          Privacy team:
        </p>
        <div className="mt-6 space-y-4 not-prose">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-6 gap-x-8 border-t border-[#E8E4DC] pt-6">
            <div>
              <p className="text-xs tracking-[0.15em] uppercase text-[#9B9B95] font-medium mb-1">
                Email
              </p>
              <a
                href="mailto:privacy@maisonandform.com"
                className="text-[#1C1C1A] text-sm hover:text-[#C9A96E] transition-colors duration-200"
              >
                privacy@maisonandform.com
              </a>
            </div>
            <div>
              <p className="text-xs tracking-[0.15em] uppercase text-[#9B9B95] font-medium mb-1">
                Phone
              </p>
              <a
                href="tel:+18005550192"
                className="text-[#1C1C1A] text-sm hover:text-[#C9A96E] transition-colors duration-200"
              >
                +1 (800) 555-0192
              </a>
            </div>
            <div>
              <p className="text-xs tracking-[0.15em] uppercase text-[#9B9B95] font-medium mb-1">
                Address
              </p>
              <address className="text-[#1C1C1A] text-sm not-italic leading-relaxed">
                Maison & Form, Inc.
                <br />
                142 West 26th Street, Suite 700
                <br />
                New York, NY 10001
              </address>
            </div>
          </div>
          <p className="text-sm text-[#6B6B67] pt-2">
            We aim to respond to all privacy-related enquiries within 5
            business days.
          </p>
        </div>
      </>
    ),
  },
];

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>Privacy Policy — Maison & Form</title>
        <meta
          name="description"
          content="Learn how Maison & Form collects, uses, and protects your personal information."
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Inter:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div
        className="min-h-screen"
        style={{ backgroundColor: "#FAFAF8", fontFamily: "'Inter', sans-serif" }}
      >
        {/* Minimal top bar */}
        <div className="border-b border-[#E8E4DC]">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
            <span
              className="text-lg tracking-[0.12em] uppercase text-[#1C1C1A]"
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
            >
              Maison & Form
            </span>
            <nav className="hidden sm:flex items-center gap-8">
              <a href="#" className="text-xs tracking-[0.12em] uppercase text-[#6B6B67] hover:text-[#1C1C1A] transition-colors">
                Collections
              </a>
              <a href="#" className="text-xs tracking-[0.12em] uppercase text-[#6B6B67] hover:text-[#1C1C1A] transition-colors">
                Rooms
              </a>
              <a href="#" className="text-xs tracking-[0.12em] uppercase text-[#6B6B67] hover:text-[#1C1C1A] transition-colors">
                Trade
              </a>
            </nav>
          </div>
        </div>

        <main>
          {/* Hero */}
          <section className="max-w-5xl mx-auto px-6 pt-16 pb-14 border-b border-[#E8E4DC]">
            <p className="text-xs tracking-[0.2em] uppercase text-[#C9A96E] font-medium mb-5">
              Legal
            </p>
            <h1
              className="text-4xl sm:text-5xl text-[#1C1C1A] leading-tight mb-5"
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
            >
              Privacy Policy
            </h1>
            <p className="text-xs tracking-[0.12em] uppercase text-[#9B9B95] mb-7">
              Last Updated: {LAST_UPDATED}
            </p>
            <p className="text-base text-[#6B6B67] leading-relaxed max-w-2xl" style={{ fontWeight: 300 }}>
              At Maison & Form, we believe trust is the foundation of every
              relationship — including the one we share with our customers. This
              Privacy Policy explains, in plain language, what personal
              information we collect, why we collect it, and how we protect it.
              We are committed to handling your data with the same care and
              craftsmanship we bring to every piece in our collection.
            </p>
          </section>

          {/* Two-column layout: TOC + Content */}
          <div className="max-w-5xl mx-auto px-6 py-14 flex flex-col lg:flex-row gap-14">

            {/* Sticky Table of Contents */}
            <aside className="lg:w-56 shrink-0">
              <div className="lg:sticky lg:top-10">
                <p className="text-xs tracking-[0.15em] uppercase text-[#9B9B95] font-medium mb-4">
                  Contents
                </p>
                <nav className="space-y-0">
                  {sections.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="group flex items-start gap-3 py-2 text-xs text-[#6B6B67] hover:text-[#1C1C1A] transition-colors duration-150"
                    >
                      <span className="shrink-0 text-[#C9A96E] font-medium mt-px" style={{ fontVariantNumeric: "tabular-nums" }}>
                        {section.index}
                      </span>
                      <span className="group-hover:translate-x-0.5 transition-transform duration-150 leading-snug">
                        {section.title}
                      </span>
                    </a>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 min-w-0">
              <div className="space-y-0 divide-y divide-[#E8E4DC]">
                {sections.map((section) => (
                  <PolicySection key={section.id} section={section} />
                ))}
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-[#E8E4DC] mt-4">
          <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-xs text-[#9B9B95]">
              © {new Date().getFullYear()} Maison & Form, Inc. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-xs text-[#9B9B95] hover:text-[#6B6B67] transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-xs text-[#9B9B95] hover:text-[#6B6B67] transition-colors">
                Cookie Settings
              </a>
              <a href="#" className="text-xs text-[#9B9B95] hover:text-[#6B6B67] transition-colors">
                Accessibility
              </a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

function PolicySection({ section }: { section: Section }) {
  return (
    <section id={section.id} className="group py-10 scroll-mt-8">
      <div className="flex items-start gap-5 mb-5">
        <span
          className="text-xs text-[#C9A96E] font-medium mt-1.5 shrink-0 tabular-nums"
          aria-hidden="true"
        >
          {section.index}
        </span>
        <h2
          className="text-xl sm:text-2xl text-[#1C1C1A] leading-snug"
          style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
        >
          {section.title}
        </h2>
      </div>

      <div
        className="pl-9 text-[#4A4A46] leading-relaxed space-y-4 text-sm"
        style={{ fontWeight: 300 }}
      >
        <PolicyContent content={section.content} />
      </div>
    </section>
  );
}

function PolicyContent({ content }: { content: React.ReactNode }) {
  if (typeof content !== "object" || content === null) return <>{content}</>;

  return <PolicyChildren element={content as React.ReactElement} />;
}

function PolicyChildren({ element }: { element: React.ReactElement }) {
  return React.Children.map(
    (element as React.ReactElement<{ children?: React.ReactNode }>).props?.children,
    (child: React.ReactNode, i: number) => {
      if (!React.isValidElement(child)) return child;
      const el = child as React.ReactElement<React.HTMLAttributes<HTMLElement>>;

      if (el.type === "p") {
        return (
          <p key={i} className="text-sm text-[#4A4A46] leading-7" style={{ fontWeight: 300 }}>
            {el.props.children}
          </p>
        );
      }
      if (el.type === "ul") {
        return (
          <ul key={i} className="space-y-2.5 my-4">
            {React.Children.map(el.props.children, (li: React.ReactNode, j: number) => {
              if (!React.isValidElement(li)) return li;
              const liEl = li as React.ReactElement<React.HTMLAttributes<HTMLElement>>;
              return (
                <li key={j} className="flex items-start gap-3 text-sm text-[#4A4A46] leading-7">
                  <span className="mt-2.5 w-1 h-1 rounded-full bg-[#C9A96E] shrink-0" aria-hidden="true" />
                  <span style={{ fontWeight: 300 }}>{liEl.props.children}</span>
                </li>
              );
            })}
          </ul>
        );
      }
      if (el.type === "div") {
        return <div key={i} {...el.props} />;
      }
      if (el.type === "address") {
        return <address key={i} {...el.props} />;
      }
      return child;
    }
  ) as unknown as React.ReactElement;
}