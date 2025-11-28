import {
  deletePaymentProof,
  getSinglePaymentProofDetail,
  updatePaymentProof,
} from "@/store/slices/superAdminSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

const StatusBadge = ({ status }) => {
  const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full";
  const statusClasses = {
    Pending: "bg-yellow-100 text-yellow-800",
    Approved: "bg-green-100 text-green-800",
    Rejected: "bg-red-100 text-red-800",
    Settled: "bg-blue-100 text-blue-800",
  };
  return <span className={`${baseClasses} ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>{status}</span>;
}

const PaymentProofs = () => {
  const { paymentProofs, singlePaymentProof } = useSelector((state) => state.superAdmin);
  const [openDrawer, setOpenDrawer] = useState(false);
  const dispatch = useDispatch();

  const handleFetchPaymentDetail = (id) => {
    dispatch(getSinglePaymentProofDetail(id));
  };

  useEffect(() => {
    if (singlePaymentProof && Object.keys(singlePaymentProof).length > 0) {
      setOpenDrawer(true);
    }
  }, [singlePaymentProof]);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paymentProofs.length > 0 ? (
              paymentProofs.map((element) => (
                <tr key={element._id} className="hover:bg-gray-50">
                  <td className="py-4 px-6 text-sm text-gray-500 truncate" style={{maxWidth: '150px'}}>{element.userId}</td>
                  <td className="py-4 px-6 text-sm font-medium text-gray-900">${element.amount.toLocaleString()}</td>
                  <td className="py-4 px-6"><StatusBadge status={element.status} /></td>
                  <td className="py-4 px-6 flex items-center gap-2">
                    <button onClick={() => handleFetchPaymentDetail(element._id)} className="text-sm bg-[var(--brand)] text-white py-1 px-3 rounded-md hover:opacity-90">Update</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="4" className="text-center py-8 text-gray-500">No payment proofs found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <Drawer setOpenDrawer={setOpenDrawer} openDrawer={openDrawer} />
    </>
  );
};

export const Drawer = ({ setOpenDrawer, openDrawer }) => {
  const { singlePaymentProof, loading } = useSelector((state) => state.superAdmin);
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
      if (singlePaymentProof) {
          setAmount(singlePaymentProof.amount || "");
          setStatus(singlePaymentProof.status || "");
      }
  }, [singlePaymentProof]);

  const dispatch = useDispatch();
  const handlePaymentProofUpdate = () => {
    dispatch(updatePaymentProof(singlePaymentProof._id, status, amount));
    setOpenDrawer(false);
  };
  
  if (!openDrawer || !singlePaymentProof) return null;

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-60 flex justify-end z-50 transition-opacity duration-300 ${openDrawer ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
      <div className={`bg-white w-full max-w-md h-full shadow-xl transition-transform duration-300 ${openDrawer ? "translate-x-0" : "translate-x-full"}`} >
        <div className="p-6 h-full flex flex-col">
            <h3 className="text-2xl font-semibold text-[var(--foreground)]">Update Proof</h3>
            <p className="text-[var(--muted-foreground)] mb-6">Review and update the payment status.</p>
            
            <div className="space-y-4 flex-grow">
                 <div>
                    <label className="text-sm font-medium text-gray-500">User ID</label>
                    <input type="text" value={singlePaymentProof.userId || ""} disabled className="w-full mt-1 p-2 border bg-gray-50 rounded-md"/>
                </div>
                 <div>
                    <label className="text-sm font-medium text-gray-500">Amount</label>
                    <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"/>
                </div>
                 <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--brand)]">
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Settled">Settled</option>
                    </select>
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-500">User Comment</label>
                    <textarea value={singlePaymentProof.comment || ""} disabled rows={4} className="w-full mt-1 p-2 border bg-gray-50 rounded-md"/>
                </div>
                <Link to={singlePaymentProof.proof?.url || ""} target="_blank" rel="noopener noreferrer" className="block text-center w-full bg-gray-100 text-gray-700 font-semibold py-2 rounded-md hover:bg-gray-200">View Screenshot</Link>
            </div>
            
            <div className="mt-6 flex gap-3">
                <button type="button" onClick={() => setOpenDrawer(false)} className="w-full bg-gray-200 text-gray-700 font-semibold py-3 rounded-md hover:bg-gray-300">Cancel</button>
                <button type="button" onClick={handlePaymentProofUpdate} disabled={loading} className="w-full bg-[var(--brand)] text-white font-semibold py-3 rounded-md hover:opacity-90 disabled:opacity-50">
                    {loading ? "Updating..." : "Update"}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};


export default PaymentProofs;