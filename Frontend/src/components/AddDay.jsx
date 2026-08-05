import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import useApi from "../customeHooks/useApi";

const AddDay = () => {
    const { apiData, Api } = useApi()
    const { tripId } = useParams();
    const navigate = useNavigate()
    const [day, setDay] = useState({
        location: "",
        hotel: "",
        caption: "",
        expenses: "",
        food: "",
        images: []
    });
    function handleChange(e) {
        setDay({ ...day, [e.target.name]: e.target.value });
    }
    function handleImages(e) {
        setDay({ ...day, images: [...e.target.files] });
    }
    async function handleSubmit() {
        const formData = new FormData();
        formData.append("location", day.location);
        formData.append("hotel", day.hotel);
        formData.append("caption", day.caption);
        formData.append("expenses", day.expenses);
        day.images.forEach(image => {
            formData.append("images", image);
        });
        const res = await Api(`http://localhost:8080/trip/${tripId}/addDay`, "patch", formData);
        navigate('/myTrips')
    }
    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card shadow border-0 rounded-4">
                        <div className="card-body p-5">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h2 className="fw-bold">
                                    Add Day
                                </h2>
                            </div>
                            <div className="mb-4">
                                <label className="form-label fw-semibold">
                                    Location
                                </label>
                                <input
                                    className="form-control"
                                    placeholder="Kuta Beach, Bali"
                                    name="location"
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="form-label fw-semibold">
                                    Stayed At
                                </label>
                                <input
                                    className="form-control"
                                    placeholder="Kuta Resort"
                                    name="hotel"
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="form-label fw-semibold">
                                    Today's Story
                                </label>
                                <textarea
                                    rows="4"
                                    className="form-control"
                                    placeholder="Write about today..."
                                    name="caption"
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="form-label fw-semibold">
                                    Expenses
                                </label>
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="₹4500"
                                    name="expenses"
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="form-label fw-semibold">
                                    Photos
                                </label>
                                <input
                                    type="file"
                                    multiple
                                    className="form-control"
                                    onChange={handleImages}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="form-label fw-semibold">
                                    Food
                                </label>
                                <input
                                    className="form-control"
                                    placeholder="Seafood, Pizza..."
                                    name="food"
                                    onChange={handleChange}
                                />
                            </div>
                            <button
                                className="btn btn-primary w-100"
                                onClick={handleSubmit}
                            >
                                Save Day
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddDay;