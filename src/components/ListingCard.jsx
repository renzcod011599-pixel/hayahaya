import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

function ListingCard({ item, user, startEdit, deleteListing, loadListings }) {
  return (
    <div style={{
      border: "1px solid #eee",
      padding: "15px",
      marginBottom: "15px",
      borderRadius: "12px",
      background: "#fff",
      boxShadow: "0 3px 10px rgba(0,0,0,0.05)"
    }}>
      {item.imageUrl && (
        <img
          src={item.imageUrl}
          alt="listing"
          style={{
            width: "100%",
            height: "200px",
            objectFit: "cover",
            borderRadius: "10px",
            marginBottom: "10px"
          }}
        />
      )}

      <h3>{item.title}</h3>
      {item.featured && <span>⭐ Featured</span>}

      <p>{item.purpose} • {item.type}</p>
      <p><strong>Price:</strong> {item.price}</p>
      <p>{item.location}, {item.city}</p>
      <p>{item.description}</p>
      <p><strong>Contact:</strong> {item.contact}</p>

      {user && user.uid === item.userId && (
        <>
          <button onClick={() => startEdit(item)}>Edit</button>
          <button onClick={() => deleteListing(item.id)}>Delete</button>
          <button
            onClick={async () => {
              const listingDoc = doc(db, "listings", item.id);
              await updateDoc(listingDoc, { featured: !item.featured });
              await loadListings();
            }}
          >
            {item.featured ? "Unfeature" : "Feature"}
          </button>
        </>
      )}
    </div>
  );
}

export default ListingCard;