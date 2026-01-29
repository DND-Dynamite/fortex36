
import React from 'react';
import { Camera, Fingerprint, Upload, Save, CreditCard } from 'lucide-react';

const PatientRegistration: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Patient Onboarding</h1>
          <p className="text-slate-500">Securely capture identity and initiate digital footprints.</p>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-xl border border-blue-100">
          <CreditCard size={20} />
          <span className="font-bold">UHID: AUTO-GENERATING</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 space-y-8">
          {/* Identity Section */}
          <section className="space-y-6">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
              1. Basic Identity
              <div className="h-[1px] flex-1 bg-slate-100"></div>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Full Legal Name (as per Govt ID)</label>
                <input type="text" placeholder="Enter first, middle, and last name" className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Date of Birth</label>
                <input type="date" className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Gender</label>
                <div className="flex gap-4">
                  {['Male', 'Female', 'Other'].map(g => (
                    <label key={g} className="flex-1 flex items-center justify-center gap-2 p-3 bg-slate-50 border-2 border-transparent rounded-xl cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition-all peer-checked:bg-blue-600">
                      <input type="radio" name="gender" className="hidden" />
                      <span className="text-sm font-semibold">{g}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Unique ID Type (KYC)</label>
                <select className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                  <option>Passport</option>
                  <option>Driver's License</option>
                  <option>National ID / Aadhar</option>
                  <option>Insurance Card</option>
                </select>
              </div>
            </div>
          </section>

          {/* Verification Section */}
          <section className="space-y-6">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
              2. Verification & Biometrics
              <div className="h-[1px] flex-1 bg-slate-100"></div>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border-2 border-dashed border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center text-center space-y-4 hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer group">
                <div className="p-4 bg-slate-100 rounded-2xl group-hover:bg-blue-100 group-hover:text-blue-600 transition-all">
                  <Upload size={32} />
                </div>
                <div>
                  <p className="font-bold text-slate-700">Upload ID Scans</p>
                  <p className="text-xs text-slate-500">PDF, JPG up to 5MB</p>
                </div>
              </div>

              <div className="border-2 border-dashed border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center text-center space-y-4 hover:border-emerald-400 hover:bg-emerald-50 transition-all cursor-pointer group">
                <div className="p-4 bg-slate-100 rounded-2xl group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-all">
                  <Fingerprint size={32} />
                </div>
                <div>
                  <p className="font-bold text-slate-700">Biometric Sync</p>
                  <p className="text-xs text-slate-500">Face / Thumb Scan</p>
                </div>
              </div>

              <div className="border-2 border-dashed border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center text-center space-y-4 hover:border-purple-400 hover:bg-purple-50 transition-all cursor-pointer group">
                <div className="p-4 bg-slate-100 rounded-2xl group-hover:bg-purple-100 group-hover:text-purple-600 transition-all">
                  <Camera size={32} />
                </div>
                <div>
                  <p className="font-bold text-slate-700">Capture Profile</p>
                  <p className="text-xs text-slate-500">Real-time WebCam</p>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section className="space-y-6">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
              3. Emergency Contact
              <div className="h-[1px] flex-1 bg-slate-100"></div>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Contact Person Name</label>
                <input type="text" placeholder="Primary relative/friend" className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Emergency Phone</label>
                <input type="tel" placeholder="+1 (555) 000-0000" className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
              </div>
            </div>
          </section>
        </div>

        <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end gap-4">
          <button className="px-8 py-3 bg-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-300 transition-all">Discard</button>
          <button className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2">
            <Save size={20} />
            Onboard Patient
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientRegistration;
