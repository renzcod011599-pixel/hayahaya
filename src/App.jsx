import { useState, useEffect, useRef } from "react";
import { db, auth, provider } from "./firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

function App() {
  const [listings, setListings] = useState([]);
  const formRef = useRef(null);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [contact, setContact] = useState("");
  const [type, setType] = useState("Room");
  const [city, setCity] = useState("Manila");

  const [searchLocation, setSearchLocation] = useState("");
  const [filterType, setFilterType] = useState("All");

  const [user, setUser] = useState(null);
  const [editId, setEditId] = useState(null);

  const listingsCollection = collection(db, "listings");

  const inputStyle = {
    width: "100%",
    padding: "12px",
    marginBottom: "10px",
    boxSizing: "border-box",
  };

  const addListing = async () => {
    if (editId) {
      const listingDoc = doc(db, "listings", editId);

      await updateDoc(listingDoc, {
        title,
        price,
        location,
        description,
        contact,
        type,
        city,
      });

      setEditId(null);
    } else {
      await addDoc(listingsCollection, {
        title,
        price,
        location,
        description,
        contact,
        type,
        city,
        userName: user?.displayName,
        userId: user?.uid,
        featured: false, // ⭐ monetization field
      });
    }

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

  const deleteListing = async (id) => {
    const listingDoc = doc(db, "listings", id);
    await deleteDoc(listingDoc);
    loadListings();
  };

  const startEdit = (item) => {
    setTitle(item.title);
    setPrice(item.price);
    setLocation(item.location);
    setDescription(item.description);
    setContact(item.contact);
    setType(item.type);
    setCity(item.city);

    setEditId(item.id);

    formRef.current.scrollIntoView({ behavior: "smooth" });
  };

  // ⭐ Toggle featured (for testing monetization)
  const toggleFeatured = async (item) => {
    const listingDoc = doc(db, "listings", item.id);
    await updateDoc(listingDoc, {
      featured: !item.featured,
    });
    loadListings();
  };

  const login = async () => {
    const result = await signInWithPopup(auth, provider);
    setUser(result.user);
  };

  const logout = () => {
    signOut(auth);
    setUser(null);
  };

  useEffect(() => {
    loadListings();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "auto",
        padding: "20px",
        fontFamily: "Arial",
      }}
    >
      <h1 style={{ textAlign: "center" }}>🏠 Apartment Finder PH</h1>

      {user ? (
        <div style={{ marginBottom: "15px" }}>
          <p>Welcome, {user.displayName}</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={login}>Login with Google</button>
      )}

      <h2 ref={formRef}>
        {editId ? "✏️ Edit Listing" : "Add Your Property"}
      </h2>

      <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} style={inputStyle} />
      <input placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} style={inputStyle} />
      <input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} style={inputStyle} />
      <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} style={inputStyle} />
      <input placeholder="Contact Number" value={contact} onChange={(e) => setContact(e.target.value)} style={inputStyle} />

      <select value={type} onChange={(e) => setType(e.target.value)} style={inputStyle}>
        <option value="Room">Room</option>
        <option value="Apartment">Apartment</option>
      </select>

      <input value={city} onChange={(e) => setCity(e.target.value)} style={inputStyle} />

      {user ? (
        <>
          <button
            onClick={addListing}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            {editId ? "Update Listing" : "Submit"}
          </button>

          {editId && (
            <button
              onClick={() => {
                setEditId(null);
                setTitle("");
                setPrice("");
                setLocation("");
                setDescription("");
                setContact("");
                setType("Room");
                setCity("Manila");
              }}
              style={{
                width: "100%",
                marginTop: "10px",
                padding: "12px",
                backgroundColor: "#ccc",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          )}
        </>
      ) : (
        <p>Please login to post a listing</p>
      )}

      <hr />

      <h2>Search</h2>

      <input
        placeholder="Search location"
        value={searchLocation}
        onChange={(e) => setSearchLocation(e.target.value)}
        style={inputStyle}
      />

      <select value={filterType} onChange={(e) => setFilterType(e.target.value)} style={inputStyle}>
        <option value="All">All</option>
        <option value="Room">Room</option>
        <option value="Apartment">Apartment</option>
      </select>

      <hr />

      <h2>Available Listings</h2>

      {[...listings]
        .sort((a, b) => (b.featured === true) - (a.featured === true))
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
              border: "1px solid #ddd",
              padding: "15px",
              borderRadius: "10px",
              marginBottom: "15px",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            }}
          >
            {item.featured && (
              <p style={{ color: "orange", fontWeight: "bold" }}>
                ⭐ Featured
              </p>
            )}

            <h3>{item.title}</h3>
            <p>Type: {item.type}</p>
            <p>Price: {item.price}</p>
            <p>Location: {item.location}, {item.city}</p>
            <p>{item.description}</p>
            <p>Contact: {item.contact}</p>
            <p>Posted by: {item.userName}</p>

            {user && user.uid === item.userId && (
              <>
                <button onClick={() => startEdit(item)} style={{ marginRight: "10px" }}>
                  Edit
                </button>
                <button onClick={() => deleteListing(item.id)} style={{ marginRight: "10px" }}>
                  Delete
                </button>
                <button onClick={() => toggleFeatured(item)}>
                  {item.featured ? "Unfeature" : "Feature"}
                </button>
              </>
            )}
          </div>
        ))}
    </div>
  );
}

export default App;