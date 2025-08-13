
import React from 'react';

// Illustration Components
const Illustration1 = () => (
    <svg viewBox="0 0 80 80" className="w-20 h-20">
        <g fill="none" fillRule="evenodd">
            <rect fill="#1F2937" width="80" height="80" rx="12"></rect>
            <circle fill="#374151" cx="40" cy="22" r="9"></circle>
            <path fill="#374151" d="M25,50 h30 a15,12 0 0,1 -30,0"></path>
            <rect fill="#4B5563" x="15" y="45" width="50" height="8" rx="4"></rect>
            <rect fill="#4B5563" x="15" y="58" width="50" height="8" rx="4"></rect>
        </g>
    </svg>
);

const Illustration2 = () => (
    <svg viewBox="0 0 80 80" className="w-20 h-20">
        <g fill="none" fillRule="evenodd">
            <rect fill="#1F2937" width="80" height="80" rx="12"></rect>
            <rect fill="#111827" x="8" y="15" width="64" height="50" rx="4"></rect>
            <circle fill="#EF4444" cx="20" cy="27" r="4"></circle>
            <rect fill="#4B5563" x="30" y="24" width="40" height="6" rx="3"></rect>
            <path d="M15,45 C20,35 25,55 30,45 C35,35 40,55 45,45 C50,35 55,55 60,45 C65,35 70,55 75,45" stroke="#3B82F6" strokeWidth="2" fill="none"></path>
        </g>
    </svg>
);

const Illustration3 = () => (
    <svg viewBox="0 0 80 80" className="w-20 h-20">
        <g fill="none" fillRule="evenodd">
            <rect fill="#1F2937" width="80"height="80" rx="12"></rect>
            {/* Fader 1 */}
            <rect fill="#111827" x="15" y="15" width="10" height="50" rx="5"></rect>
            <rect fill="#3B82F6" x="12" y="45" width="16" height="6" rx="3"></rect>
            {/* Fader 2 */}
            <rect fill="#111827" x="35" y="15" width="10" height="50" rx="5"></rect>
            <rect fill="#4B5563" x="32" y="25" width="16" height="6" rx="3"></rect>
            {/* Fader 3 */}
            <rect fill="#111827" x="55" y="15" width="10" height="50" rx="5"></rect>
            <rect fill="#4B5563" x="52" y="55" width="16" height="6" rx="3"></rect>
        </g>
    </svg>
);

const Illustration4 = () => (
    <svg viewBox="0 0 80 80" className="w-20 h-20">
        <g fill="none" fillRule="evenodd">
            <rect fill="#1F2937" width="80" height="80" rx="12"></rect>
            {/* Save Icon */}
            <path d="M60 62H20a2 2 0 01-2-2V20a2 2 0 012-2h32l8 8v24a2 2 0 01-2 2z" fill="#374151"></path>
            <path d="M52 26h8v-8" fill="#4B5563"></path>
            <rect fill="#4B5563" x="25" y="48" width="30" height="6" rx="3"></rect>
            <rect fill="#4B5563" x="32" y="28" width="16" height="6" rx="3"></rect>
            {/* Arrow down */}
            <path d="M40 35 L40 55 M35 50 L40 55 L45 50" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"></path>
        </g>
    </svg>
);


const Step: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="flex flex-col items-center text-center">
        <div className="flex items-center justify-center w-24 h-24 mb-6 bg-gray-900 border-2 border-blue-500/10 rounded-xl">
            {icon}
        </div>
        <h4 className="text-xl font-orbitron font-bold text-white mb-2">{title}</h4>
        <p className="text-gray-400 max-w-xs">{children}</p>
    </div>
);

export const HowItWorks: React.FC = () => {
    return (
        <section className="py-20 bg-black">
            <div className="container mx-auto px-4">
                <h3 className="text-3xl md:text-4xl font-orbitron font-bold text-center text-white mb-16">
                    How It Works
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    <Step icon={<Illustration1 />} title="1. Sign Up">
                        Create a secure account using Google or Apple. Choose the free plan to start or go Premium for full access.
                    </Step>
                    <Step icon={<Illustration2 />} title="2. Record Tracks">
                        Arm a track and hit record. With our easy drag-and-drop system, laying down ideas has never been faster.
                    </Step>
                    <Step icon={<Illustration3 />} title="3. Mix & Process">
                        Use the built-in mixer, EQ, and our special real-time vocal preset (Premium only) to make your tracks shine.
                    </Step>
                    <Step icon={<Illustration4 />} title="4. Save & Share">
                        Save your project directly to your device. Your music, in your hands, ready to be shared with the world.
                    </Step>
                </div>
            </div>
        </section>
    );
}
