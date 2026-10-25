// Legal pages for MyClasses (website, web portal, mobile apps, admin panel).
//
// Company details come from env vars so they can be filled in without code
// changes. SET THESE BEFORE GOING LIVE (see .env.example). Have a lawyer review
// the final text — this is a solid, product-specific starting point, not legal advice.

const env = (k, d) => (process.env[k] && String(process.env[k]).trim()) || d;

export const company = {
  brand: 'MyClasses',
  entity: env('NEXT_PUBLIC_LEGAL_ENTITY', 'MyClasses'),
  address: env('NEXT_PUBLIC_LEGAL_ADDRESS', ''),
  email: env('NEXT_PUBLIC_CONTACT_EMAIL', 'hello@myclasses.app'),
  privacyEmail: env('NEXT_PUBLIC_PRIVACY_EMAIL', env('NEXT_PUBLIC_CONTACT_EMAIL', 'hello@myclasses.app')),
  phone: env('NEXT_PUBLIC_CONTACT_PHONE', ''),
  grievanceName: env('NEXT_PUBLIC_GRIEVANCE_OFFICER', 'Grievance Officer'),
  grievanceEmail: env('NEXT_PUBLIC_GRIEVANCE_EMAIL', env('NEXT_PUBLIC_PRIVACY_EMAIL', env('NEXT_PUBLIC_CONTACT_EMAIL', 'hello@myclasses.app'))),
  jurisdiction: env('NEXT_PUBLIC_LEGAL_JURISDICTION', 'India'),
  website: env('NEXT_PUBLIC_SITE_URL', 'https://myclasses.app'),
};

export const LAST_UPDATED = '21 October 2026';

// Order used by the footer, the legal index and the sitemap.
export const legalPages = [
  { slug: 'privacy', title: 'Privacy Policy', short: 'Privacy' },
  { slug: 'terms', title: 'Terms of Service', short: 'Terms' },
  { slug: 'cookies', title: 'Cookie Policy', short: 'Cookies' },
  { slug: 'refund-policy', title: 'Refund & Cancellation Policy', short: 'Refunds' },
  { slug: 'shipping-policy', title: 'Shipping & Delivery Policy', short: 'Shipping' },
  { slug: 'data-deletion', title: 'Account & Data Deletion', short: 'Delete account' },
];

const c = company;
const contactLine = `${c.privacyEmail}${c.phone ? ` · ${c.phone}` : ''}${c.address ? ` · ${c.address}` : ''}`;

// Body items: a string is a paragraph; { list: [...] } is a bullet list;
// { table: { head: [...], rows: [[...]] } } is a simple table.
export const documents = {
  privacy: {
    title: 'Privacy Policy',
    summary: `How ${c.brand} collects, uses, shares and protects personal data across our website, web portal, mobile apps and admin panel.`,
    sections: [
      {
        id: 'who-we-are',
        heading: '1. Who we are and how this policy applies',
        body: [
          `${c.brand} ("we", "us") is operated by ${c.entity}. We provide a school management platform used by schools and institutes ("Schools") and by their administrators, teachers, staff, students and parents ("Users").`,
          'This policy covers our marketing website, the web portal, the MyClasses mobile apps for Android and iOS, the admin panel and our APIs (together, the "Services").',
          { list: [
            'For data that a School puts into the Services (student, parent and staff records, attendance, fees, exams and similar), the School decides why and how that data is used. Under the Digital Personal Data Protection Act, 2023 ("DPDP Act") the School is the Data Fiduciary and we process the data on its behalf as a Data Processor, under our agreement with the School.',
            'For data we collect directly, such as website enquiries, School billing contacts and website usage, we are the Data Fiduciary.',
          ] },
          'If you are a student, parent or staff member, your School is your first point of contact for questions about your records. We will help the School respond.',
        ],
      },
      {
        id: 'data-we-collect',
        heading: '2. Personal data we collect',
        body: [
          { table: {
            head: ['Category', 'Examples', 'Source'],
            rows: [
              ['Account and identity', 'Name, School code, role, employee or admission number, email, phone, password (stored hashed), profile photo', 'School, or you'],
              ['Student and family', 'Class, section, roll number, date of birth, gender, blood group, address, parent or guardian names and phone numbers, medical notes the School chooses to record', 'School'],
              ['Academic records', 'Attendance, timetable, assignments and submissions, exam marks, report cards, library issues, transport and hostel allocation', 'School, teachers, students'],
              ['Fees and payments', 'Invoices, amounts, payment status, transaction and order IDs. Card, UPI and bank details are entered on the payment gateway\'s own page and never reach our servers', 'School, payment gateway'],
              ['Staff self check-in (only if the School turns it on)', 'Location at the moment of check-in or check-out (latitude, longitude, accuracy, distance from school), face photos for verification, a device identifier to link one phone to the account, fingerprint machine punch records', 'Your device, the School\'s fingerprint machine'],
              ['Device and technical', 'Push notification token, app version, device model and OS, IP address, logs needed for security and troubleshooting', 'Your device'],
              ['Website enquiries', 'Name, email, phone, organisation, city, approximate number of students, your message', 'You'],
            ],
          } },
          'We do not sell personal data, show third-party advertising, or use children\'s data for profiling or targeted advertising.',
        ],
      },
      {
        id: 'location-face',
        heading: '3. Location, camera and face verification',
        body: [
          'These features are for teachers and staff only, and only when their School has enabled them. Students and parents are never asked for location or face data.',
          { list: [
            'Location: read only when you tap Check in or Check out, to confirm you are within the School\'s allowed radius. We do not track location in the background or at any other time.',
            'Camera and face check: when you check in, the app asks you to blink and turn your head, then takes a few photos. These are compared with a reference photo that your School administrator has approved. The comparison runs on Amazon Web Services (AWS Rekognition).',
            'A face photo is used only to confirm that the right person is marking attendance. It is not used for any other purpose. Reference photos are kept until you or your School delete them, or until your account is removed.',
            'If you do not want to use location or face verification, ask your School for another way to mark attendance, such as manual marking or a fingerprint machine.',
          ] },
        ],
      },
      {
        id: 'children',
        heading: '4. Children\'s data',
        body: [
          'Many students are under 18. Schools that use the Services must get verifiable consent from a parent or lawful guardian before entering a child\'s personal data, as the DPDP Act requires.',
          'We process children\'s data only to provide the education services the School asks for. We do not track, monitor behaviour or target advertising at children.',
        ],
      },
      {
        id: 'how-we-use',
        heading: '5. How we use personal data',
        body: [
          { list: [
            'To provide the Services: sign-in, dashboards, attendance, fees, exams, notifications and the other modules the School uses.',
            'To process payments through our payment partners and to issue invoices and receipts.',
            'To send service messages: one-time passwords, push notifications, emails and SMS that your School or the system triggers.',
            'To keep the Services secure: preventing fraud and misuse, rate-limiting and keeping audit logs (for example, logs of check-in attempts).',
            'To provide support and to answer website enquiries.',
            'To meet legal obligations, such as tax and accounting records, and lawful requests from authorities.',
          ] },
        ],
      },
      {
        id: 'sharing',
        heading: '6. Who we share data with',
        body: [
          'We share personal data only with service providers that help us run the Services. They are bound by contract to use it only for that purpose:',
          { list: [
            'Cloud hosting and storage (for the database, files and backups).',
            'Amazon Web Services: Rekognition for face comparison, and SES for email.',
            'Google Firebase, for push notifications.',
            'Razorpay and Cashfree, the payment gateways that process fee and subscription payments.',
            'SMS providers, for one-time passwords and alerts.',
          ] },
          'We may also share data if the law requires it, to protect people\'s safety or rights, or as part of a merger or acquisition. In that last case, the protections in this policy would continue to apply.',
          'Some providers may process data outside India. Where this happens, we follow the DPDP Act and any restrictions the Government of India sets.',
        ],
      },
      {
        id: 'retention',
        heading: '7. How long we keep data',
        body: [
          { list: [
            'School data is kept while the School\'s subscription is active. When a School leaves, we delete or return its data within 90 days, unless the law requires us to keep it longer.',
            'Payment and invoice records are kept for as long as Indian tax and accounting laws require (generally 8 years).',
            'Website enquiries are kept for up to 24 months after our last contact with you.',
            'Security logs are generally kept for up to 12 months.',
          ] },
        ],
      },
      {
        id: 'security',
        heading: '8. Security',
        body: [
          'Data is encrypted in transit (HTTPS/TLS). Passwords are stored hashed. Sensitive settings, such as gateway credentials, are encrypted at rest. Access is limited by role and School, and we keep regular backups.',
          'No system is completely secure. If a personal data breach occurs, we will inform the affected Schools and, where the law requires, the Data Protection Board of India and the affected people.',
        ],
      },
      {
        id: 'rights',
        heading: '9. Your rights',
        body: [
          'Subject to the DPDP Act and other applicable law, you can:',
          { list: [
            'Ask what personal data is held about you and how it is used.',
            'Ask for inaccurate or incomplete data to be corrected or updated.',
            'Ask for your data to be erased once it is no longer needed. Note that Schools may have to keep certain academic records.',
            'Withdraw consent where processing is based on consent.',
            'Nominate another person to exercise your rights if you die or become incapacitated.',
            'Raise a grievance with us. If you are not satisfied with our response, you can complain to the Data Protection Board of India.',
          ] },
          'Students, parents and staff should usually contact their School first. You can also write to us, and we will pass the request to your School and help it respond. To delete an account, see our Account & Data Deletion page.',
        ],
      },
      {
        id: 'grievance',
        heading: '10. Grievance Officer and contact',
        body: [
          `In line with the Information Technology Act, 2000 and the rules made under it, and with the DPDP Act, you can contact our ${c.grievanceName} at ${c.grievanceEmail}. We will acknowledge complaints within 24 hours and aim to resolve them within 15 days.`,
          `General privacy questions: ${contactLine}.`,
        ],
      },
      {
        id: 'changes',
        heading: '11. Changes to this policy',
        body: [
          'We may update this policy from time to time. If we make significant changes, we will tell Schools and show a notice in the Services before the changes take effect. The "Last updated" date at the top of this page shows the current version.',
        ],
      },
    ],
  },

  terms: {
    title: 'Terms of Service',
    summary: `The rules for using ${c.brand}. By using the Services you agree to these terms.`,
    sections: [
      {
        id: 'agreement',
        heading: '1. Agreement',
        body: [
          `These Terms of Service ("Terms") are an agreement between you and ${c.entity} ("${c.brand}", "we", "us") and cover your use of our website, web portal, mobile apps, admin panel and APIs (the "Services").`,
          'If you use the Services on behalf of a School, you confirm that you are authorised to accept these Terms for that School. A separate order form or subscription agreement with a School takes priority over these Terms where the two conflict.',
          'If you are under 18, your parent or guardian must agree to these Terms for you, and your School must have their consent to use your data.',
        ],
      },
      {
        id: 'accounts',
        heading: '2. Accounts and security',
        body: [
          { list: [
            'Schools create accounts for their administrators, teachers, staff, students and parents. You must give accurate information and keep it up to date.',
            'Keep your password and one-time passwords private. You are responsible for activity on your account. If you think someone else has accessed your account, tell your School or us straight away.',
            'Where a School enables it, one phone may be linked to a staff account for attendance. Only the School can unlink it.',
          ] },
        ],
      },
      {
        id: 'school-duties',
        heading: '3. School responsibilities',
        body: [
          { list: [
            'The School is responsible for the data it enters and for having a lawful basis to process it. This includes verifiable parental consent for children, and staff consent for location and face verification where required.',
            'The School decides which features to turn on, who can access what, and its own attendance, fee and refund rules.',
            'The School must keep administrator credentials secure and remove access for people who leave.',
          ] },
        ],
      },
      {
        id: 'acceptable-use',
        heading: '4. Acceptable use',
        body: [
          'You must not:',
          { list: [
            'Break the law or infringe anyone\'s rights, including privacy and intellectual property rights.',
            'Upload content that is abusive, obscene, defamatory, hateful, or harmful to children.',
            'Try to access accounts, schools or data that you are not allowed to see.',
            'Probe, scan or test the Services for vulnerabilities, or disrupt them. If you find a security issue, report it to us.',
            'Fake your location, use photos or videos of another person for face verification, or otherwise falsify attendance.',
            'Copy, resell, reverse engineer or build a competing product from the Services, except where the law allows it.',
          ] },
          'We may suspend access that breaks these rules. Where it is appropriate, we will tell the School.',
        ],
      },
      {
        id: 'payments',
        heading: '5. Fees and payments',
        body: [
          { list: [
            'Schools pay subscription and setup fees according to their plan or order form. Unless stated otherwise, prices are in Indian Rupees and do not include GST.',
            'Fees, event charges and store purchases paid by parents or students go to the School. The School sets the amounts and decides its own refund rules. Payments are processed by our payment partners (Razorpay or Cashfree) under their own terms.',
            'A platform fee or gateway charge may be shown before you pay. Refunds are covered by our Refund & Cancellation Policy.',
            'If subscription invoices are not paid, we may restrict access after giving reasonable notice.',
          ] },
        ],
      },
      {
        id: 'ip',
        heading: '6. Intellectual property and your content',
        body: [
          `The Services, including the software, design and the ${c.brand} brand, belong to us or our licensors. We give you a limited, non-exclusive, non-transferable right to use them while your access is active.`,
          'The School and Users keep ownership of the data and content they upload. You allow us to host, process and display it only to provide the Services.',
        ],
      },
      {
        id: 'availability',
        heading: '7. Availability, changes and third parties',
        body: [
          'We work to keep the Services available, but maintenance, outages or problems with third parties (for example, payment gateways, SMS or push providers, or app stores) may sometimes interrupt them. We may improve or change features. If a change significantly reduces the core features a School pays for, we will give that School notice.',
        ],
      },
      {
        id: 'disclaimer',
        heading: '8. Disclaimers and limitation of liability',
        body: [
          'The Services are provided "as is" and "as available". To the extent the law allows, we do not give implied warranties of merchantability, fitness for a particular purpose or non-infringement.',
          'To the extent the law allows, we are not liable for indirect, incidental or consequential losses, or for loss of profits or data. Our total liability for any claim is limited to the fees the School paid us in the 12 months before the claim. Nothing in these Terms limits liability that cannot be limited by law.',
        ],
      },
      {
        id: 'termination',
        heading: '9. Suspension and termination',
        body: [
          'You can stop using the Services at any time, and Schools can end their subscription according to their plan. We may suspend or end access for serious or repeated breaches of these Terms, or where the law requires it. When access ends, data is handled as described in our Privacy Policy.',
        ],
      },
      {
        id: 'law',
        heading: '10. Governing law and disputes',
        body: [
          `These Terms are governed by the laws of India. Courts in ${c.jurisdiction} have exclusive jurisdiction, subject to any dispute resolution clause in a School's agreement with us. We encourage you to contact us first. Most issues can be resolved quickly.`,
        ],
      },
      {
        id: 'contact',
        heading: '11. Contact',
        body: [`Questions about these Terms: ${c.email}. Grievances: ${c.grievanceName}, ${c.grievanceEmail}.`],
      },
    ],
  },

  cookies: {
    title: 'Cookie Policy',
    summary: 'What we store in your browser and app, and why.',
    sections: [
      {
        id: 'what',
        heading: '1. What cookies and local storage are',
        body: [
          'Cookies are small text files that a website saves in your browser. Local storage and app storage work in a similar way. We use these technologies only to make the Services work.',
        ],
      },
      {
        id: 'we-use',
        heading: '2. What we use',
        body: [
          { table: {
            head: ['Name or type', 'Purpose', 'Kind', 'Duration'],
            rows: [
              ['Sign-in tokens (web portal and app storage)', 'Keep you signed in and securely link your requests to your account', 'Strictly necessary', 'Until you sign out or the token expires'],
              ['Session and CSRF cookies (admin panel)', 'Keep administrators signed in and protect forms from cross-site request forgery', 'Strictly necessary', 'Browser session, or up to 2 hours of inactivity'],
              ['Preferences (for example, sidebar collapsed or cookie notice seen)', 'Remember interface choices on your device', 'Functional', 'Until you clear your browser data'],
              ['Payment checkout (Razorpay or Cashfree)', 'Set by the payment gateway while you pay, for fraud prevention and to complete the payment', 'Strictly necessary (third party)', 'Set by the provider'],
            ],
          } },
          'We do not use advertising or cross-site tracking cookies. If we ever add analytics, we will update this policy and ask for your consent where required.',
        ],
      },
      {
        id: 'control',
        heading: '3. Your choices',
        body: [
          'You can block or delete cookies in your browser settings. If you block strictly necessary cookies or storage, you will not be able to sign in. Uninstalling the app or signing out clears the app\'s stored sign-in data.',
        ],
      },
      {
        id: 'contact',
        heading: '4. Contact',
        body: [`Questions: ${c.privacyEmail}.`],
      },
    ],
  },

  'refund-policy': {
    title: 'Refund & Cancellation Policy',
    summary: 'How cancellations and refunds work for School subscriptions and for payments made to Schools through MyClasses.',
    sections: [
      {
        id: 'subscriptions',
        heading: '1. School subscriptions and setup fees (paid to MyClasses)',
        body: [
          { list: [
            'Schools can cancel a subscription at any time. The cancellation takes effect at the end of the current billing period, and access continues until then.',
            'Subscription fees already paid for a billing period are not refundable, except where the law requires a refund or your order form says otherwise.',
            'If you are charged twice, or charged in error, we will refund the extra amount in full. Contact us within 30 days of the charge.',
            'Onboarding, setup, data migration and training fees are not refundable once the work has started.',
            'Some plans include a free trial. You are not charged during the trial unless you choose to upgrade.',
          ] },
        ],
      },
      {
        id: 'school-payments',
        heading: '2. Fees, events and store purchases (paid to your School)',
        body: [
          'School fees, event registrations and store items are paid to your School. The School decides whether a refund is given. Contact the School office for refunds or cancellations. If the School approves a refund, it is processed through the same payment gateway.',
          'Event registrations can be cancelled up to the event\'s registration deadline, unless the School has set different rules for that event.',
        ],
      },
      {
        id: 'failed',
        heading: '3. Failed or pending payments',
        body: [
          'If money is debited but the payment shows as failed or pending, it is usually reversed automatically by your bank or the gateway within 5 to 7 working days. If it is not, send us the transaction ID and we will follow up with the gateway.',
        ],
      },
      {
        id: 'timeline',
        heading: '4. Refund timeline',
        body: [
          'Approved refunds go back to the original payment method within 5 to 10 working days of approval. How long it takes after that depends on your bank or card issuer.',
        ],
      },
      {
        id: 'contact',
        heading: '5. Contact',
        body: [`Billing and refunds: ${c.email}${c.phone ? ` · ${c.phone}` : ''}. Please include your School code and the transaction or invoice number.`],
      },
    ],
  },

  'shipping-policy': {
    title: 'Shipping & Delivery Policy',
    summary: 'How MyClasses services and School store items are delivered.',
    sections: [
      {
        id: 'digital',
        heading: '1. Digital services',
        body: [
          `${c.brand} is a software service delivered online. Nothing is physically shipped. Access is usually activated within 1 to 3 working days of a School's order or payment, once onboarding details are confirmed. Receipts and invoices are sent by email and are available in the app.`,
        ],
      },
      {
        id: 'store',
        heading: '2. School store items',
        body: [
          'Items bought from a School\'s in-app store, such as books, uniforms or kits, are sold and supplied by the School. They are normally collected at the School, and the app shows when an order is ready or has been collected. MyClasses does not ship physical goods. For questions about availability, collection or exchanges, contact your School.',
        ],
      },
      {
        id: 'contact',
        heading: '3. Contact',
        body: [`${c.email}${c.phone ? ` · ${c.phone}` : ''}`],
      },
    ],
  },

  'data-deletion': {
    title: 'Account & Data Deletion',
    summary: 'How to delete your MyClasses account and the data linked to it.',
    sections: [
      {
        id: 'how',
        heading: '1. How to request deletion',
        body: [
          { list: [
            'In the app: open Profile, tap Delete account, and confirm.',
            'On the web: fill in the form on this page.',
            `By email: write to ${c.privacyEmail} from the email address registered on your account. Include your School code and role.`,
          ] },
          'Because Schools create and manage accounts, we check each request with your School before deleting anything. We confirm by email or phone and normally complete the deletion within 30 days.',
        ],
      },
      {
        id: 'what',
        heading: '2. What is deleted',
        body: [
          { list: [
            'Your sign-in account and profile (name, contact details, photo).',
            'Linked devices and push notification tokens.',
            'Face verification photos and check-in location history, for staff.',
          ] },
        ],
      },
      {
        id: 'kept',
        heading: '3. What may be kept',
        body: [
          'Some records belong to your School or must be kept by law. These may be kept, but they will no longer be linked to an active account:',
          { list: [
            'Academic records the School must keep, such as admission details, attendance registers, marks and transfer certificates.',
            'Payment and invoice records, which tax and accounting laws require us to keep (generally 8 years).',
            'Limited security logs, kept for up to 12 months.',
          ] },
        ],
      },
      {
        id: 'school',
        heading: '4. Schools leaving MyClasses',
        body: [
          'A School can ask for all of its data to be exported or deleted when its subscription ends. We complete this within 90 days, except for records the law requires us to keep.',
        ],
      },
    ],
  },
};
