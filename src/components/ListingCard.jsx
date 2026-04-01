function ListingCard({ item }) {
  return (
    <div style={{
      border: "1px solid #333",
      padding: "15px",
      marginBottom: "15px",
      borderRadius: "10px",
      background: "#111"
    }}>
      {item.imageUrl && (
        <img
          src={item.imageUrl}
          style={{
            width: "100%",
            height: "200px",
            objectFit: "cover",
            borderRadius: "8px",
            marginBottom: "10px"
          }}
        />
      )}

      <h3>{item.title}</h3>
      <p>{item.purpose} • {item.type}</p>
      <p>₱ {item.price}</p>
      <p>{item.location}, {item.city}</p>
      <p>{item.description}</p>
      <p>Contact: {item.contact}</p>
    </div>
  );
}

export default ListingCard;