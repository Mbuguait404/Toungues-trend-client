// 'use client'

// import { useState } from 'react'
// import AdminTopBar from '@/components/admin-topbar'
// import { ChevronDown, Eye, EyeOff, Upload } from 'lucide-react'

// const emailTemplates = {
//   welcome: {
//     name: 'Welcome Email',
//     subject: 'Welcome to Tongues Trend!',
//     body: 'Hi {{name}},\n\nWelcome to Tongues Trend! We\'re excited to have you learn {{course}} with us.\n\nYour journey to language mastery starts now.\n\nBest regards,\nThe Tongues Trend Team',
//   },
//   reminder: {
//     name: 'Session Reminder',
//     subject: 'Your {{course}} lesson is coming up!',
//     body: 'Hi {{name}},\n\nDon\'t forget! Your {{course}} lesson is on {{date}} at {{time}}.\n\nReady to learn? See you then!\n\nThe Tongues Trend Team',
//   },
//   certificate: {
//     name: 'Certificate Issued',
//     subject: 'Congratulations! You\'ve earned your {{course}} {{level}} certificate!',
//     body: 'Hi {{name}},\n\nCongratulations on completing {{course}} at {{level}}! You\'ve demonstrated excellent progress.\n\nYour certificate is attached.\n\nThe Tongues Trend Team',
//   },
//   receipt: {
//     name: 'Payment Receipt',
//     subject: 'Payment Confirmation - {{amount}} {{currency}}',
//     body: 'Hi {{name}},\n\nThank you for your payment of {{amount}} {{currency}} for {{course}}.\n\nYour receipt is attached.\n\nThe Tongues Trend Team',
//   },
// }

// export default function AdminSettings() {
//   const [activeTab, setActiveTab] = useState('platform')
//   const [selectedTemplate, setSelectedTemplate] = useState('welcome')
//   const [templateBody, setTemplateBody] = useState(emailTemplates.welcome.body)
//   const [maintenanceMode, setMaintenanceMode] = useState(false)
//   const [registrationOpen, setRegistrationOpen] = useState(true)
//   const [showMPesaKey, setShowMPesaKey] = useState(false)
//   const [showStripeKey, setShowStripeKey] = useState(false)
//   const [supportedCurrencies, setSupportedCurrencies] = useState({
//     KES: true,
//     EUR: true,
//     CHF: true,
//     USD: true,
//   })

//   const tabs = [
//     { label: 'Platform Settings', value: 'platform' },
//     { label: 'Email Templates', value: 'email' },
//     { label: 'Certificate Branding', value: 'certificate' },
//     { label: 'Payment Settings', value: 'payments' },
//   ]

//   const handleTemplateChange = (templateKey: string) => {
//     setSelectedTemplate(templateKey)
//     setTemplateBody(emailTemplates[templateKey as keyof typeof emailTemplates].body)
//   }

//   const handleCurrencyToggle = (currency: string) => {
//     setSupportedCurrencies(prev => ({
//       ...prev,
//       [currency]: !prev[currency],
//     }))
//   }

//   return (
//     <div className="flex-1 flex flex-col overflow-hidden">
//       <AdminTopBar title="Platform Settings" />
      
//       <div className="flex-1 overflow-auto">
//         <div className="p-8 max-w-4xl">
//           {/* Tabs */}
//           <div className="flex gap-0 border-b border-gray-100 mb-8">
//             {tabs.map(tab => (
//               <button
//                 key={tab.value}
//                 onClick={() => setActiveTab(tab.value)}
//                 className={`px-6 py-3 font-semibold transition-all text-sm ${
//                   activeTab === tab.value
//                     ? 'text-gold border-b-2 border-gold'
//                     : 'text-gray-mid hover:text-navy'
//                 }`}
//               >
//                 {tab.label}
//               </button>
//             ))}
//           </div>

//           {/* Platform Settings Tab */}
//           {activeTab === 'platform' && (
//             <div className="space-y-6">
//               <div className="bg-white rounded-2xl border border-gray-100 p-6">
//                 <h3 className="text-lg font-bold text-navy mb-4" style={{ fontFamily: 'Poppins' }}>
//                   General Settings
//                 </h3>
                
//                 <div className="space-y-4">
//                   <div>
//                     <label className="text-sm font-semibold text-navy mb-2 block">Platform Name</label>
//                     <input
//                       type="text"
//                       defaultValue="Tongues Trend"
//                       className="w-full border border-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold"
//                     />
//                   </div>

//                   <div>
//                     <label className="text-sm font-semibold text-navy mb-2 block">Support Email</label>
//                     <input
//                       type="email"
//                       defaultValue="support@tonguestrend.com"
//                       className="w-full border border-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold"
//                     />
//                   </div>

//                   <div>
//                     <label className="text-sm font-semibold text-navy mb-2 block">Default Currency</label>
//                     <select className="w-full border border-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold">
//                       <option>KES - Kenyan Shilling</option>
//                       <option>EUR - Euro</option>
//                       <option>CHF - Swiss Franc</option>
//                       <option>USD - US Dollar</option>
//                     </select>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-white rounded-2xl border border-gray-100 p-6">
//                 <h3 className="text-lg font-bold text-navy mb-4" style={{ fontFamily: 'Poppins' }}>
//                   Platform Status
//                 </h3>
                
//                 <div className="space-y-4">
//                   <div className="flex items-center justify-between p-4 bg-gray-light rounded-lg">
//                     <div>
//                       <p className="font-semibold text-navy mb-1">Maintenance Mode</p>
//                       <p className="text-sm text-gray-mid">Temporarily disable platform access for maintenance</p>
//                     </div>
//                     <button
//                       onClick={() => setMaintenanceMode(!maintenanceMode)}
//                       className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
//                         maintenanceMode ? 'bg-red-500' : 'bg-gray-300'
//                       }`}
//                     >
//                       <span
//                         className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
//                           maintenanceMode ? 'translate-x-7' : 'translate-x-1'
//                         }`}
//                       />
//                     </button>
//                   </div>

//                   <div className="flex items-center justify-between p-4 bg-gray-light rounded-lg">
//                     <div>
//                       <p className="font-semibold text-navy mb-1">Allow New Registrations</p>
//                       <p className="text-sm text-gray-mid">Allow users to create new accounts</p>
//                     </div>
//                     <button
//                       onClick={() => setRegistrationOpen(!registrationOpen)}
//                       className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
//                         registrationOpen ? 'bg-green-500' : 'bg-gray-300'
//                       }`}
//                     >
//                       <span
//                         className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
//                           registrationOpen ? 'translate-x-7' : 'translate-x-1'
//                         }`}
//                       />
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               <div className="flex gap-4">
//                 <button className="px-8 py-3 border border-gray-100 rounded-full font-semibold text-navy hover:bg-gray-50 transition-colors">
//                   Cancel
//                 </button>
//                 <button className="px-8 py-3 bg-gold hover:bg-gold-light text-navy rounded-full font-semibold transition-colors">
//                   Save Changes
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Email Templates Tab */}
//           {activeTab === 'email' && (
//             <div className="space-y-6">
//               <div className="bg-white rounded-2xl border border-gray-100 p-6">
//                 <h3 className="text-lg font-bold text-navy mb-4" style={{ fontFamily: 'Poppins' }}>
//                   Email Templates
//                 </h3>

//                 <div className="mb-6">
//                   <label className="text-sm font-semibold text-navy mb-2 block">Select Template</label>
//                   <select
//                     value={selectedTemplate}
//                     onChange={(e) => handleTemplateChange(e.target.value)}
//                     className="w-full border border-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold"
//                   >
//                     {Object.entries(emailTemplates).map(([key, template]) => (
//                       <option key={key} value={key}>{template.name}</option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="mb-6">
//                   <label className="text-sm font-semibold text-navy mb-2 block">Email Body</label>
//                   <textarea
//                     value={templateBody}
//                     onChange={(e) => setTemplateBody(e.target.value)}
//                     className="w-full border border-gray-100 rounded-lg px-4 py-3 h-64 focus:outline-none focus:ring-2 focus:ring-gold resize-none"
//                   />
//                 </div>

//                 <div className="bg-gray-light rounded-lg p-4 mb-6">
//                   <p className="text-sm font-semibold text-navy mb-3">Available Variables</p>
//                   <div className="grid grid-cols-2 gap-3">
//                     <code className="text-xs bg-white rounded px-3 py-2 font-mono">{'{{name}}'}</code>
//                     <code className="text-xs bg-white rounded px-3 py-2 font-mono">{'{{course}}'}</code>
//                     <code className="text-xs bg-white rounded px-3 py-2 font-mono">{'{{date}}'}</code>
//                     <code className="text-xs bg-white rounded px-3 py-2 font-mono">{'{{time}}'}</code>
//                     <code className="text-xs bg-white rounded px-3 py-2 font-mono">{'{{amount}}'}</code>
//                     <code className="text-xs bg-white rounded px-3 py-2 font-mono">{'{{currency}}'}</code>
//                   </div>
//                 </div>

//                 <div className="flex gap-4">
//                   <button className="px-8 py-3 border border-gray-100 rounded-full font-semibold text-navy hover:bg-gray-50 transition-colors">
//                     Cancel
//                   </button>
//                   <button className="px-8 py-3 bg-gold hover:bg-gold-light text-navy rounded-full font-semibold transition-colors">
//                     Save Template
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Certificate Branding Tab */}
//           {activeTab === 'certificate' && (
//             <div className="space-y-6">
//               <div className="bg-white rounded-2xl border border-gray-100 p-6">
//                 <h3 className="text-lg font-bold text-navy mb-4" style={{ fontFamily: 'Poppins' }}>
//                   Certificate Branding
//                 </h3>

//                 <div className="mb-6">
//                   <label className="text-sm font-semibold text-navy mb-2 block">Certificate Logo</label>
//                   <div className="border-2 border-dashed border-gray-100 rounded-lg p-8 text-center hover:border-gold transition-colors cursor-pointer">
//                     <Upload size={32} className="mx-auto mb-2 text-gray-mid" />
//                     <p className="text-sm font-semibold text-navy">Click to upload certificate logo</p>
//                     <p className="text-xs text-gray-mid">PNG or SVG, max 2MB</p>
//                   </div>
//                 </div>

//                 <div className="mb-6">
//                   <label className="text-sm font-semibold text-navy mb-2 block">Certificate Title</label>
//                   <input
//                     type="text"
//                     defaultValue="Certificate of Language Proficiency"
//                     className="w-full border border-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold"
//                   />
//                 </div>

//                 <div className="grid grid-cols-2 gap-6 mb-6">
//                   <div>
//                     <label className="text-sm font-semibold text-navy mb-2 block">Signatory Name</label>
//                     <input
//                       type="text"
//                       defaultValue="Sarah Johnson"
//                       className="w-full border border-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold"
//                     />
//                   </div>
//                   <div>
//                     <label className="text-sm font-semibold text-navy mb-2 block">Signatory Title</label>
//                     <input
//                       type="text"
//                       defaultValue="Director of Education"
//                       className="w-full border border-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold"
//                     />
//                   </div>
//                 </div>

//                 <div className="flex gap-4">
//                   <button className="px-8 py-3 border border-gold rounded-full font-semibold text-gold hover:bg-gold hover:text-navy transition-colors">
//                     Preview Certificate
//                   </button>
//                   <button className="px-8 py-3 bg-gold hover:bg-gold-light text-navy rounded-full font-semibold transition-colors">
//                     Save Branding
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Payment Settings Tab */}
//           {activeTab === 'payments' && (
//             <div className="space-y-6">
//               <div className="bg-white rounded-2xl border border-gray-100 p-6">
//                 <h3 className="text-lg font-bold text-navy mb-4" style={{ fontFamily: 'Poppins' }}>
//                   M-Pesa Configuration
//                 </h3>

//                 <div className="mb-6">
//                   <label className="text-sm font-semibold text-navy mb-2 block">Paybill/Till Number</label>
//                   <input
//                     type="text"
//                     defaultValue="123456"
//                     className="w-full border border-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold"
//                   />
//                 </div>

//                 <div className="mb-6">
//                   <label className="text-sm font-semibold text-navy mb-2 block">API Key</label>
//                   <div className="relative">
//                     <input
//                       type={showMPesaKey ? 'text' : 'password'}
//                       defaultValue="YOUR_M_PESA_API_KEY"
//                       className="w-full border border-gray-100 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-gold"
//                     />
//                     <button
//                       onClick={() => setShowMPesaKey(!showMPesaKey)}
//                       className="absolute right-3 top-3.5 text-gray-mid hover:text-navy"
//                     >
//                       {showMPesaKey ? <EyeOff size={18} /> : <Eye size={18} />}
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-white rounded-2xl border border-gray-100 p-6">
//                 <h3 className="text-lg font-bold text-navy mb-4" style={{ fontFamily: 'Poppins' }}>
//                   Stripe Configuration
//                 </h3>

//                 <div className="mb-6">
//                   <label className="text-sm font-semibold text-navy mb-2 block">Publishable Key</label>
//                   <div className="relative">
//                     <input
//                       type={showStripeKey ? 'text' : 'password'}
//                       defaultValue="YOUR_STRIPE_PUBLISHABLE_KEY"
//                       className="w-full border border-gray-100 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-gold"
//                     />
//                     <button
//                       onClick={() => setShowStripeKey(!showStripeKey)}
//                       className="absolute right-3 top-3.5 text-gray-mid hover:text-navy"
//                     >
//                       {showStripeKey ? <EyeOff size={18} /> : <Eye size={18} />}
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-white rounded-2xl border border-gray-100 p-6">
//                 <h3 className="text-lg font-bold text-navy mb-4" style={{ fontFamily: 'Poppins' }}>
//                   Supported Currencies
//                 </h3>

//                 <div className="space-y-3 mb-6">
//                   {Object.entries(supportedCurrencies).map(([currency, enabled]) => (
//                     <div key={currency} className="flex items-center justify-between p-4 bg-gray-light rounded-lg">
//                       <span className="font-semibold text-navy">{currency}</span>
//                       <button
//                         onClick={() => handleCurrencyToggle(currency)}
//                         className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
//                           enabled ? 'bg-green-500' : 'bg-gray-300'
//                         }`}
//                       >
//                         <span
//                           className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
//                             enabled ? 'translate-x-7' : 'translate-x-1'
//                           }`}
//                         />
//                       </button>
//                     </div>
//                   ))}
//                 </div>

//                 <div className="flex gap-4">
//                   <button className="px-8 py-3 border border-gray-100 rounded-full font-semibold text-navy hover:bg-gray-50 transition-colors">
//                     Cancel
//                   </button>
//                   <button className="px-8 py-3 bg-gold hover:bg-gold-light text-navy rounded-full font-semibold transition-colors">
//                     Save Payment Settings
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }
