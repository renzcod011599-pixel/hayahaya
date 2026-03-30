import { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

function App() {
  const [listings, setListings] = useState([]);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [contact, setContact] = useState("");
  const [type, setType] = useState("Room");
  const [city, setCity] = useState("Manila");

  const [searchLocation, setSearchLocation] = useState("");
  const [filterType, setFilterType] = useState("All");

  const listingsCollection = collection(db, "listings");

  const addListing = async () => {
    await addDoc(listingsCollection, {
      title,
      price,
      location,
      description,
      contact,
      type,
      city,
    });

    setTitle("");
    setPrice("");
    setLocation("");
    setDescription("");
    setContact("");
    setType("Room");
    setCity("Manila");

    loadListings();
  };

  const loadListings = async () => {
    const data = await getDocs(listingsCollection);
    setListings(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  useEffect(() => {
    loadListings();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>🏠 Manila Apartment Finder</h1>

      <h2>Add Your Property</h2>

      <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} /><br /><br />
      <input placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} /><br /><br />
      <input placeholder="Location (e.g. Sampaloc)" value={location} onChange={(e) => setLocation(e.target.value)} /><br /><br />
      <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} /><br /><br />
      <input placeholder="Contact Number" value={contact} onChange={(e) => setContact(e.target.value)} /><br /><br />

      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="Room">Room</option>
        <option value="Apartment">Apartment</option>
      </select><br /><br />

      <input value={city} onChange={(e) => setCity(e.target.value)} /><br /><br />

      <button onClick={addListing}>Submit</button>

      <hr />

      <h2>Search</h2>

      <input
        placeholder="Search location"
        value={searchLocation}
        onChange={(e) => setSearchLocation(e.target.value)}
      /><br /><br />

      <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
        <option value="All">All</option>
        <option value="Room">Room</option>
        <option value="Apartment">Apartment</option>
      </select>

      <hr />

      <h2>Available Listings</h2>

      {listings
        .filter((item) => {
          const matchLocation = (item.location || "")
            .toLowerCase()
            .includes(searchLocation.toLowerCase());

          const matchType =
            filterType === "All" || item.type === filterType;

          return matchLocation && matchType;
        })
        .map((item) => (
          <div
            key={item.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <h3>{item.title}</h3>
            <p>Type: {item.type}</p>
            <p>Price: {item.price}</p>
            <p>
              Location: {item.location}, {item.city}
            </p>
            <p>{item.description}</p>
            <p>Contact: {item.contact}</p>
          </div>
        ))}
    </div>
  );
}

export default App;