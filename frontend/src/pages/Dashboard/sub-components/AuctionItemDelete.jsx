import { deleteAuctionItem } from "@/store/slices/superAdminSlice";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FiTrash2, FiEye } from "react-icons/fi";

const AuctionItemDelete = () => {
  const { allAuctions } = useSelector((state) => state.auction);
  const dispatch = useDispatch();

  const handleAuctionDelete = (id) => {
    if (window.confirm("Are you sure you want to permanently delete this auction?")) {
      dispatch(deleteAuctionItem(id));
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Bid</th>
            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {allAuctions.length > 0 ? (
            allAuctions.map((element) => {
              const now = new Date();
              const endTime = new Date(element.endTime);
              const status = now > endTime ? "Ended" : "Active";
              return (
                <tr key={element._id} className="hover:bg-gray-50">
                  <td className="py-4 px-6 flex items-center gap-4">
                     <img src={element.image?.url} alt={element.title} className="h-10 w-10 object-cover rounded-md"/>
                     <span className="font-semibold text-gray-800">{element.title}</span>
                  </td>
                  <td className="py-4 px-6 text-sm font-medium text-gray-900">${element.currentBid.toLocaleString()}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${status === "Ended" ? "bg-gray-100 text-gray-800" : "bg-green-100 text-green-800"}`}>{status}</span>
                  </td>
                  <td className="py-4 px-6 flex items-center gap-2">
                    <Link to={`/auction/item/${element._id}`} className="text-gray-500 hover:text-[var(--brand)] p-2 rounded-full hover:bg-gray-100"><FiEye size={18} /></Link>
                    <button onClick={() => handleAuctionDelete(element._id)} className="text-gray-500 hover:text-red-600 p-2 rounded-full hover:bg-red-50"><FiTrash2 size={18} /></button>
                  </td>
                </tr>
              )
            })
          ) : (
             <tr><td colSpan="4" className="text-center py-8 text-gray-500">No auctions to display.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AuctionItemDelete;