function ListingForm(props) {
  const inputStyle = {
    width: "100%",
    padding: "14px",
    marginBottom: "14px",
    borderRadius: "10px",
    border: "1px solid #333",
    background: "#111",
    color: "#fff",
    fontSize: "14px"
  };

  const buttonStyle = {
    width: "100%",
    padding: "14px",
    background: "linear-gradient(135deg, #007bff, #00c6ff)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontWeight: "bold",
    cursor: "pointer"
  };

  return (
    <>
      <h2 style={{ marginBottom: "20px" }} ref={props.formRef}>
        {props.editId ? "✏️ Edit Listing" : "➕ Add New Property"}
      </h2>

      <input placeholder="Property Title" value={props.title} onChange={(e) => props.setTitle(e.target.value)} style={inputStyle} />
      <input placeholder="Price (₱)" value={props.price} onChange={(e) => props.setPrice(e.target.value)} style={inputStyle} />
      <input placeholder="House No., Floor, Street" value={props.location} onChange={(e) => props.setLocation(e.target.value)} style={inputStyle} />

      <select value={props.city} onChange={(e) => props.setCity(e.target.value)} style={inputStyle}>
        <option value="">City</option>
        <option>Manila</option>
        <option>Quezon City</option>
        <option>Caloocan</option>
        <option>Las Piñas</option>
        <option>Makati</option>
        <option>Malabon</option>
        <option>Mandaluyong</option>
        <option>Marikina</option>
        <option>Muntinlupa</option>
        <option>Navotas</option>
        <option>Parañaque</option>
        <option>Pasay</option>
        <option>Pasig</option>
        <option>San Juan</option>
        <option>Taguig</option>
        <option>Valenzuela</option>
        <option>Pateros</option>
      </select>

      <textarea
        placeholder="Description (Optional)"
        value={props.description || ""}
        onChange={(e) => props.setDescription(e.target.value)}
        style={{ ...inputStyle, minHeight: "100px" }}
      />

      <input placeholder="Contact Number" value={props.contact} onChange={(e) => props.setContact(e.target.value)} style={inputStyle} />

      <div style={{ marginBottom: "14px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>Upload Image</label>
        <input type="file" accept="image/*" onChange={(e) => props.setImage(e.target.files[0])} />
        {props.image && <small>{props.image.name}</small>}
      </div>

      <select value={props.type} onChange={(e) => props.setType(e.target.value)} style={inputStyle}>
        <option value="">Property Type</option>
        <option>Room</option>
        <option>Apartment</option>
        <option>House</option>
      </select>

      <select value={props.purpose} onChange={(e) => props.setPurpose(e.target.value)} style={inputStyle}>
        <option value="">Purpose</option>
        <option>Rent</option>
        <option>Sale</option>
      </select>

      {props.user ? (
        <button onClick={props.addListing} style={buttonStyle}>
          {props.editId ? "Update Listing" : "Submit"}
        </button>
      ) : (
        <p>Please login</p>
      )}
    </>
  );
}

export default ListingForm;