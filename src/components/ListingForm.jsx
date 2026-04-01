function ListingForm(props) {
  const inputStyle = {
    width: "100%",
    padding: "12px",
    marginBottom: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    background: "#fff",
    color: "#333",
  };

  const buttonStyle = {
    width: "100%",
    padding: "12px",
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
  };

  return (
    <>
      <h2 ref={props.formRef}>
        {props.editId ? "✏️ Edit Listing" : "Add Property"}
      </h2>

      <input placeholder="Title" value={props.title} onChange={(e) => props.setTitle(e.target.value)} style={inputStyle} />
      <input placeholder="Price" value={props.price} onChange={(e) => props.setPrice(e.target.value)} style={inputStyle} />
      <input placeholder="House No., Floor, Street" value={props.location} onChange={(e) => props.setLocation(e.target.value)} style={inputStyle} />

      <select value={props.city} onChange={(e) => props.setCity(e.target.value)} style={inputStyle}>
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

      <textarea
        placeholder="Description"
        rows={4}
        value={props.description || ""}
        onChange={(e) => props.setDescription(e.target.value)}
        style={inputStyle}
      />

      <input placeholder="Contact Number" value={props.contact} onChange={(e) => props.setContact(e.target.value)} style={inputStyle} />

      {/* IMAGE UPLOAD */}
      <input type="file" onChange={(e) => props.setImage(e.target.files[0])} style={inputStyle} />

      <select value={props.type} onChange={(e) => props.setType(e.target.value)} style={inputStyle}>
        <option value="" disabled>Property Type</option>
        <option value="Room">Room</option>
        <option value="Apartment">Apartment</option>
        <option value="House">House</option>
        <option value="Lot">Lot</option>
        <option value="House & Lot">House & Lot</option>
        <option value="Vehicle">Vehicle</option>
      </select>

      <select value={props.purpose} onChange={(e) => props.setPurpose(e.target.value)} style={inputStyle}>
        <option value="" disabled>For Rent / For Sale</option>
        <option value="Rent">For Rent</option>
        <option value="Sale">For Sale</option>
      </select>

      {props.user ? (
        <button style={buttonStyle} onClick={props.addListing}>
          {props.editId ? "Update Listing" : "Submit"}
        </button>
      ) : (
        <p>Please login to post a listing</p>
      )}
    </>
  );
}

export default ListingForm;