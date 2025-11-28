import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postCommissionProof } from "@/store/slices/commissionSlice";
import { FiUpload } from "react-icons/fi";

const SubmitCommission = () => {
  const [proof, setProof] = useState(null);
  const [amount, setAmount] = useState("");
  const [comment, setComment] = useState("");

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.commission);

  const proofHandler = (e) => {
    const file = e.target.files[0];
    setProof(file);
  };

  const handlePaymentProof = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("proof", proof);
    formData.append("amount", amount);
    formData.append("comment", comment);
    dispatch(postCommissionProof(formData));
  };

  return (
    <section className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col items-center justify-center min-h-screen">
      <div className="max-w-2xl mx-auto w-full">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-[var(--foreground)]">Submit Commission Proof</h1>
            <p className="text-lg text-[var(--muted-foreground)] mt-2">
              Upload proof of your commission payment for review.
            </p>
          </div>
          <form className="space-y-6" onSubmit={handlePaymentProof}>
            <input
              type="number"
              placeholder="Amount Paid ($)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
            />
            <textarea
              placeholder="Comment (e.g., Transaction ID, Date)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              required
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
            />
            <div>
              <label className="font-medium text-[var(--muted-foreground)] mb-2 block">Payment Screenshot</label>
              <input
                type="file"
                onChange={proofHandler}
                required
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--brand)] file:text-white hover:file:opacity-90"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--brand)] text-white font-bold text-lg px-8 py-3 rounded-md hover:opacity-90 transition-opacity duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <FiUpload />
              {loading ? "Submitting..." : "Submit Proof"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SubmitCommission;