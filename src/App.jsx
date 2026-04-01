import { useState, useEffect, useRef } from "react";
import { db, auth, provider, storage } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from "firebase/firestore";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import ListingForm from "./components/ListingForm";
import ListingCard from "./components/ListingCard";

function App() {
  const [listings, setListings] = useState([]);
  const [search, setSearch] = useState("");

  const formRef = useRef(null);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [contact, setContact] = useState("");
  const [type, setType] = useState("");
  const [purpose, setPurpose] = useState("");
  const [city, setCity] = useState("");
  const [image, setImage] = useState(null);

  const [user, setUser] = useState(null);
  const [editId, setEditId] = useState(null);

  const listingsCollection = collection(db, "listings");

  const clearForm = () => {
    setTitle("");
    setPrice("");
    setLocation("");
    setDescription("");
    setContact("");
    setType("");
    setPurpose("");
    setCity("");
    setImage(null);
  };

  const loadListings = async () => {
    const data = await getDocs(listingsCollection);
    setListings(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const addListing = async () => {
    try {
      if (!title || !price || !location || !contact || !type || !purpose || !city) {
        alert("Please fill all required fields");
        return;
      }

      let imageUrl = "";

      if (image) {
        const imageRef = ref(storage, `listings/${Date.now()}_${image.name}`);
        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);
      }

      if (editId) {
        await updateDoc(doc(db, "listings", editId), {
          title,
          price,
          location,
          description,
          contact,
          type,
          purpose,
          city,
          ...(imageUrl && { imageUrl }),
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
          purpose,
          city,
          imageUrl,
          userName: user?.displayName,
          userId: user?.uid,
          featured: false,
          createdAt: Date.now(),
        });
      }

      clearForm();
      loadListings();

    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const deleteListing = async (id) => {
    if (!window.confirm("Delete this listing?")) return;
    await deleteDoc(doc(db, "listings", id));
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

    formRef.current.scrollIntoView({ behavior: "smooth" });
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
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  return (
    <div style={{
      maxWidth: "700px",
      margin: "40px auto",
      padding: "25px",
      fontFamily: "Arial",
      background: "#fff",
      borderRadius: "15px",
      boxShadow: "0 5px 20px rgba(0,0,0,0.1)"
    }}>
      <h1 style={{ textAlign: "center" }}>🌴 Hayahaya</h1>

      {user ? (
        <>
          <p>Welcome, {user.displayName}</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button onClick={login}>Login with Google</button>
      )}

      <ListingForm
        formRef={formRef}
        title={title}
        setTitle={setTitle}
        price={price}
        setPrice={setPrice}
        location={location}
        setLocation={setLocation}
        description={description}
        setDescription={setDescription}
        contact={contact}
        setContact={setContact}
        type={type}
        setType={setType}
        purpose={purpose}
        setPurpose={setPurpose}
        city={city}
        setCity={setCity}
        setImage={setImage}
        editId={editId}
        addListing={addListing}
        user={user}
      />

      <hr />

      <input
        placeholder="🔍 Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "15px",
          borderRadius: "8px",
          border: "1px solid #ccc"
        }}
      />

      <h2>Available Listings</h2>

      {listings
        .filter((item) =>
          item.title.toLowerCase().includes(search.toLowerCase()) ||
          item.city.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => {
          if (b.featured !== a.featured) return b.featured - a.featured;
          return (b.createdAt || 0) - (a.createdAt || 0);
        })
        .map((item) => (
          <ListingCard
            key={item.id}
            item={item}
            user={user}
            startEdit={startEdit}
            deleteListing={deleteListing}
            loadListings={loadListings}
          />
        ))}
    </div>
  );
}

export default App;