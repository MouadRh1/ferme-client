import { useState, useRef } from 'react';
import { HiOutlineUpload, HiOutlineDocumentText, HiOutlineX } from 'react-icons/hi';

// Infos RIB (à personnaliser)
const RIB_INFO = {
  bank:    'Attijariwafa Bank',
  account: 'MA64 0111 2345 6789 0123 4567 890',
  name:    'Khadija Ferme SARL',
  swift:   'BCMAMAMC',
};

export default function BankTransferPayment({ advanceAmount, onFileSelect, selectedFile }) {
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  const handleFile = (file) => {
    if (!file) return;
    const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!allowed.includes(file.type)) {
      alert('Format non autorisé. Utilisez JPG, PNG ou PDF.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Fichier trop lourd (max 5 MB).');
      return;
    }
    onFileSelect(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div className="space-y-5">
      {/* RIB */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0f2419, #1a3a2a)',
          border: '1px solid rgba(201,169,110,0.2)',
        }}
      >
        <div className="px-5 py-3 flex justify-between items-center"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-white font-semibold text-sm">🏦 Coordonnées bancaires</p>
          <span
            className="text-xs px-2.5 py-1 rounded-lg font-semibold"
            style={{ background: 'rgba(201,169,110,0.2)', color: '#c9a96e' }}
          >
            {advanceAmount} DH à virer
          </span>
        </div>

        <div className="p-5 space-y-3">
          {[
            { label: 'Banque',   value: RIB_INFO.bank    },
            { label: 'Titulaire', value: RIB_INFO.name   },
            { label: 'RIB',      value: RIB_INFO.account },
            { label: 'SWIFT',    value: RIB_INFO.swift   },
          ].map(item => (
            <div key={item.label} className="flex justify-between items-center">
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                {item.label}
              </span>
              <span
                className="text-sm font-semibold font-mono cursor-pointer select-all"
                style={{ color: '#c9a96e' }}
                onClick={() => navigator.clipboard.writeText(item.value)}
                title="Cliquer pour copier"
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>

        <div className="px-5 pb-4">
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
            💡 Cliquez sur un champ pour le copier
          </p>
        </div>
      </div>

      {/* Upload preuve */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Preuve de virement *
        </label>

        {!selectedFile ? (
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
              dragOver
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-green-400 hover:bg-green-50/50'
            }`}
          >
            <HiOutlineUpload className="w-8 h-8 mx-auto text-gray-300 mb-3" />
            <p className="text-sm font-medium text-gray-600">
              Glissez votre fichier ici
            </p>
            <p className="text-xs text-gray-400 mt-1">
              ou cliquez pour parcourir
            </p>
            <p className="text-xs text-gray-300 mt-3">
              JPG, PNG, PDF · Max 5 MB
            </p>
            <input
              ref={fileRef}
              type="file"
              className="hidden"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={e => handleFile(e.target.files[0])}
            />
          </div>
        ) : (
          <div className="flex items-center gap-3 border-2 border-green-200 bg-green-50 rounded-2xl p-4">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
              <HiOutlineDocumentText className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{selectedFile.name}</p>
              <p className="text-xs text-gray-400">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
            <button
              onClick={() => onFileSelect(null)}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-100 text-gray-400 hover:text-red-500 transition"
            >
              <HiOutlineX className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}