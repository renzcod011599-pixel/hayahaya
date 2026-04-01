import { useState, useEffect, useRef } from "react";
import { db, auth, provider } from "./firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

function App() {
  const [listings, setListings] = useState([]);
  const formRef = useRef(null);
  const lastEditedRef = useRef(null);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [contact, setContact] = useState("");

  const [type, setType] = useState("");
  const [purpose, setPurpose] = useState("");
  const [city, setCity] = useState("");

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
    if (!title || !price || !location || !contact || !type || !purpose || !city) {
      alert("Please fill all required fields");
      return;
    }

    if (editId) {
      const listingDoc = doc(db, "listings", editId);

      await updateDoc(listingDoc, {
        title,
        price,
        location,
        description,
        contact,
        type,
        purpose,
        city,
      });

      const updatedId = editId;
      setEditId(null);

      setTitle("");
      setPrice("");
      setLocation("");
      setDescription("");
      setContact("");
      setType("");
      setPurpose("");
      setCity("");

      loadListings();

      setTimeout(() => {
        const el = document.getElementById(updatedId);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 300);

    } else {
      await addDoc(listingsCollection, {
        title,
        price,
        location,
        description,
        contact,
        type,
        purpose,
        city,
        userName: user?.displayName,
        userId: user?.uid,
        featured: false,
        createdAt: Date.now(),
      });

      setTitle("");
      setPrice("");
      setLocation("");
      setDescription("");
      setContact("");
      setType("");
      setPurpose("");
      setCity("");

      loadListings();
    }
  };

  const loadListings = async () => {
    const data = await getDocs(listingsCollection);
    setListings(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const deleteListing = async (id) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;

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
    setType(item.type || "");
    setPurpose(item.purpose || "");
    setCity(item.city || "");

    setEditId(item.id);
    lastEditedRef.current = item.id;

    formRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const cancelEdit = () => {
    const id = lastEditedRef.current;

    setEditId(null);
    setTitle("");
    setPrice("");
    setLocation("");
    setDescription("");
    setContact("");
    setType("");
    setPurpose("");
    setCity("");

    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 200);
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
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px", fontFamily: "Arial" }}>
      <h1 style={{ textAlign: "center" }}>🌴 Hayahaya</h1>

      {user ? (
        <div>
          <p>Welcome, {user.displayName}</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={login}>Login with Google</button>
      )}

      <h2 ref={formRef}>{editId ? "✏️ Edit Listing" : "Add Your Property"}</h2>

      <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} style={inputStyle} />
      <input placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} style={inputStyle} />

      <input placeholder="House No., Floor, Street" value={location} onChange={(e) => setLocation(e.target.value)} style={inputStyle} />

      <select value={city} onChange={(e) => setCity(e.target.value)} style={inputStyle}>
        <option value="" disabled>City</option>
        <option value="Manila">Manila</option>
        <option value="Quezon City">Quezon City</option>
        <option value="Caloocan">Caloocan</option>
        <option value="Las Piñas">Las Piñas</option>
        <option value="Makati">Makati</option>
        <option value="Malabon">Malabon</option>
        <option value="Mandaluyong">Mandaluyong</option>
        <option value="Marikina">Marikina</option>
        <option value="Muntinlupa">Muntinlupa</option>
        <option value="Navotas">Navotas</option>
        <option value="Parañaque">Parañaque</option>
        <option value="Pasay">Pasay</option>
        <option value="Pasig">Pasig</option>
        <option value="San Juan">San Juan</option>
        <option value="Taguig">Taguig</option>
        <option value="Valenzuela">Valenzuela</option>
        <option value="Pateros">Pateros</option>
      </select>

      <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} style={inputStyle} />

      <input placeholder="Contact Number" value={contact} onChange={(e) => setContact(e.target.value)} style={inputStyle} />

      <select value={type} onChange={(e) => setType(e.target.value)} style={inputStyle}>
        <option value="" disabled>Property Type</option>
        <option value="Room">Room</option>
        <option value="Apartment">Apartment</option>
        <option value="House">House</option>
        <option value="Lot">Lot</option>
        <option value="House & Lot">House & Lot</option>
        <option value="Vehicle">Vehicle</option>
      </select>

      <select value={purpose} onChange={(e) => setPurpose(e.target.value)} style={inputStyle}>
        <option value="" disabled>For Rent / For Sale</option>
        <option value="Rent">For Rent</option>
        <option value="Sale">For Sale</option>
      </select>

      {user ? (
        <>
          <button onClick={addListing} style={{ width: "100%", padding: "12px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px" }}>
            {editId ? "Update Listing" : "Submit"}
          </button>

          {editId && (
            <button onClick={cancelEdit} style={{ width: "100%", marginTop: "10px", padding: "12px", backgroundColor: "#ccc", border: "none", borderRadius: "5px" }}>
              Cancel
            </button>
          )}
        </>
      ) : (
        <p>Please login to post a listing</p>
      )}

      <hr />

      <h2>Available Listings</h2>

      {listings
        .sort((a, b) => {
          if (b.featured !== a.featured) return b.featured - a.featured;
          return (b.createdAt || 0) - (a.createdAt || 0);
        })
        .map((item) => (
          <div id={item.id} key={item.id} style={{ border: "1px solid #ddd", padding: "15px", marginBottom: "10px" }}>
            <h3>{item.title}</h3>

            {item.featured && <span>⭐ Featured</span>}

            <p>{item.purpose} • {item.type}</p>
            <p>Price: {item.price}</p>
            <p>{item.location}, {item.city}</p>
            <p>{item.description}</p>
            <p>Contact: {item.contact}</p>

            {user && user.uid === item.userId && (
              <>
                <button onClick={() => startEdit(item)}>Edit</button>
                <button onClick={() => deleteListing(item.id)}>Delete</button>
                <button
                  onClick={async () => {
                    const listingDoc = doc(db, "listings", item.id);
                    await updateDoc(listingDoc, { featured: !item.featured });
                    loadListings();
                  }}
                >
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