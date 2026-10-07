import { useState } from 'react';
import { useInitDonationMutation, useCompletePledgeMutation } from '../../redux/api/apiSlice';

export default function DonationForm({ pledgeId }) {
  const [donationAmount, setDonationAmount] = useState(500);
  const [customAmount, setCustomAmount] = useState('');

  const [initDonation, { isLoading: isDonating }] = useInitDonationMutation();
  const [completePledge, { isLoading: isCompleting }] = useCompletePledgeMutation();

  const handleDonate = async () => {
    const amount = customAmount ? parseFloat(customAmount) : donationAmount;
    if (!amount || amount <= 0) return;

    try {
      const res = await initDonation({ pledgeId, amount }).unwrap();

      if (res.success) {
        const pd = res.payuData;

        const form = document.createElement('form');
        form.method = 'POST';
        form.action = pd.url || process.env.NEXT_PUBLIC_PAYU_URL || 'https://test.payu.in/_payment';

        const inputs = {
          key: pd.key,
          txnid: pd.txnid,
          amount: pd.amount,
          productinfo: pd.productinfo,
          firstname: pd.firstname,
          email: pd.email,
          phone: pd.phone,
          surl: pd.surl,
          furl: pd.furl,
          hash: pd.hash
        };

        for (const key in inputs) {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = inputs[key];
          form.appendChild(input);
        }

        document.body.appendChild(form);
        form.submit();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleNoThanks = async () => {
    try {
      const res = await completePledge({ pledgeId }).unwrap();
      if (res.success) {
        window.location.href = `/pledge/success?id=${pledgeId}&cert=${res.certificateNumber}`;
      }
    } catch (error) {
      console.error(error);
      window.location.href = `/pledge/success?id=${pledgeId}`;
    }
  };

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[100, 250, 500, 1000].map(amt => (
          <button
            key={amt}
            onClick={() => { setDonationAmount(amt); setCustomAmount(''); }}
            className={`py-3 px-4 rounded-xl font-bold border-2 transition-all duration-300 ${donationAmount === amt && !customAmount
                ? 'border-[#0A0A0A] bg-[#0A0A0A] text-white shadow-md'
                : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:text-[#0A0A0A] bg-white'
              }`}
          >
            ₹{amt}
          </button>
        ))}
      </div>

      <div className="mb-10">
        <label className="block text-sm font-bold text-gray-700 mb-2">Other Amount (₹)</label>
        <input
          type="number"
          value={customAmount}
          onChange={(e) => { setCustomAmount(e.target.value); setDonationAmount(0); }}
          className="w-full rounded-xl bg-[#FAFAFA] border-gray-200 px-4 py-3.5 border focus:bg-white focus:border-[#0A0A0A] focus:ring-1 focus:ring-[#0A0A0A] outline-none text-gray-900 transition-all font-medium"
          placeholder="Enter custom amount"
        />
      </div>

      <div className="flex flex-col gap-3">
        <button
          onClick={handleDonate}
          disabled={isDonating || isCompleting}
          className="w-full flex justify-center py-4 px-6 rounded-full shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_25px_rgba(0,0,0,0.15)] text-lg font-bold text-white bg-[#0A0A0A] hover:bg-[#1A1A1A] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 outline-none disabled:opacity-50 disabled:hover:translate-y-0 disabled:active:scale-100 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {isDonating ? 'PROCESSING...' : 'SUPPORT CAMPAIGN'}
        </button>
        <button
          onClick={handleNoThanks}
          disabled={isCompleting || isDonating}
          className="w-full flex justify-center py-4 px-6 rounded-full bg-white text-gray-500 font-semibold border border-gray-200 hover:border-gray-300 hover:text-gray-900 hover:bg-gray-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCompleting ? 'PLEASE WAIT...' : 'NO, THANK YOU'}
        </button>
      </div>
    </div>
  );
}
