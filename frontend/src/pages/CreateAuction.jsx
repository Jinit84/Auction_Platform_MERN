import React, { useEffect, useState, useRef, useCallback } from "react";
import DatePicker from "react-datepicker";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import Webcam from "react-webcam";
import { createAuction } from "../store/slices/auctionSlice.js";
import { FiUploadCloud } from "react-icons/fi";
import { FaCamera } from "react-icons/fa";


// Helper function to convert base64 data URL to a File object
const dataURLtoFile = (dataurl, filename) => {
    let arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}

const CreateAuction = () => {
    const [image, setImage] = useState("");
    const [imagePreview, setImagePreview] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [condition, setCondition] = useState("");
    const [startingBid, setStartingBid] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [showCamera, setShowCamera] = useState(false);

    const webcamRef = useRef(null);
    const dispatch = useDispatch();
    const navigateTo = useNavigate();

    const { loading } = useSelector((state) => state.auction);
    const { isAuthenticated, user } = useSelector((state) => state.user);
    
    const auctionCategories = [ "Electronics", "Furniture", "Art & Antiques", "Jewelry & Watches", "Automobiles", "Real Estate", "Collectibles", "Fashion & Accessories", "Sports Memorabilia", "Books & Manuscripts" ];

    useEffect(() => {
        if (!isAuthenticated || user.role !== "Auctioneer") {
            navigateTo("/");
        }
    }, [isAuthenticated, user, navigateTo]);

    const imageHandler = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            setImage(file);
            setImagePreview(reader.result);
        };
    };

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
            const file = dataURLtoFile(imageSrc, 'auction-photo.jpg');
            setImage(file);
            setImagePreview(imageSrc);
            setShowCamera(false);
        }
    }, [webcamRef]);

    const handleCreateAuction = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("image", image);
        formData.append("title", title);
        formData.append("description", description);
        formData.append("category", category);
        formData.append("condition", condition);
        formData.append("startingBid", startingBid);
        formData.append("startTime", startTime);
        formData.append("endTime", endTime);
        dispatch(createAuction(formData));
    };

    return (
        <>
            <article className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col">
                <div className="max-w-4xl mx-auto w-full">
                    <h1 className="text-4xl font-bold mb-2 text-[var(--foreground)]">Create New Auction</h1>
                    <p className="text-lg text-[var(--muted-foreground)] mb-8">Fill out the details below to list your item.</p>

                    <div className="bg-white p-8 rounded-lg shadow-md">
                        <form className="space-y-6" onSubmit={handleCreateAuction}>
                            {/* Section 1: Item Details */}
                            <div>
                                <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">Item Details</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <input type="text" placeholder="Item Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--brand)]" />
                                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--brand)]">
                                        <option value="">Select Category</option>
                                        {auctionCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                    </select>
                                    <select value={condition} onChange={(e) => setCondition(e.target.value)} className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--brand)]">
                                        <option value="">Select Condition</option>
                                        <option value="New">New</option>
                                        <option value="Used">Used</option>
                                    </select>
                                    <input type="number" placeholder="Starting Bid ($)" value={startingBid} onChange={(e) => setStartingBid(e.target.value)} className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--brand)]" />
                                </div>
                                <div className="mt-6">
                                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Detailed Description" rows={6} className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--brand)]" />
                                </div>
                            </div>

                            {/* Section 2: Auction Timing */}
                            <div>
                                <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">Auction Timing</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <DatePicker selected={startTime} onChange={(date) => setStartTime(date)} showTimeSelect timeFormat="HH:mm" timeIntervals={15} dateFormat="MMMM d, yyyy h:mm aa" className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--brand)]" placeholderText="Select Start Time" />
                                    <DatePicker selected={endTime} onChange={(date) => setEndTime(date)} showTimeSelect timeFormat="HH:mm" timeIntervals={15} dateFormat="MMMM d, yyyy h:mm aa" className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--brand)]" placeholderText="Select End Time" />
                                </div>
                            </div>

                            {/* Section 3: Item Image */}
                            <div>
                                <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">Item Image</h2>
                                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt={title} className="w-auto h-48 object-contain" />
                                        ) : (
                                            <>
                                                <FiUploadCloud className="w-10 h-10 mb-4 text-gray-400" />
                                                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                                <p className="text-xs text-gray-500">PNG, JPG, or GIF</p>
                                            </>
                                        )}
                                    </div>
                                    <input id="dropzone-file" type="file" className="hidden" onChange={imageHandler} />
                                </label>
                                <div className="text-center">
                                    <p className="my-4 text-stone-600">OR</p>
                                    <button type="button" onClick={() => setShowCamera(true)} className="bg-gray-700 text-white font-semibold hover:bg-black transition-all duration-300 py-2 px-4 rounded-md flex items-center gap-2 mx-auto">
                                        <FaCamera /> Use Camera
                                    </button>
                                </div>
                            </div>
                            
                            <button type="submit" disabled={loading} className="w-full bg-[var(--brand)] text-white font-bold text-lg px-8 py-3 rounded-md hover:opacity-90 transition-opacity duration-300 disabled:opacity-50">
                                {loading ? "Creating Auction..." : "Create Auction"}
                            </button>
                        </form>
                    </div>
                </div>
            </article>

            {/* Camera Modal */}
            {showCamera && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
                    <div className="bg-white p-4 rounded-lg flex flex-col items-center">
                        <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" className="rounded-md" width={500} height={500} />
                        <div className="mt-4 flex gap-4">
                            <button onClick={capture} className="bg-blue-500 text-white font-semibold hover:bg-blue-700 transition-all duration-300 py-2 px-4 rounded-md">Take Photo</button>
                            <button onClick={() => setShowCamera(false)} className="bg-red-500 text-white font-semibold hover:bg-red-700 transition-all duration-300 py-2 px-4 rounded-md">Close Camera</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CreateAuction;