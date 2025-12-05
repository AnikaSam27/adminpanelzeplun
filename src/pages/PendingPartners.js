import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";

const PendingPartners = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "partners"), where("approved", "==", false), where("kycSubmitted", "==", true),
  where("kycVerified", "==", false));
      const snapshot = await getDocs(q);
      const partnerList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPartners(partnerList);
    } catch (error) {
      console.error("Error fetching partners:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const approvePartner = async (id) => {
    try {
      await updateDoc(doc(db, "partners", id), { approved: true, kycVerified: true });
      setPartners(prev => prev.filter(p => p.id !== id));
      alert("Partner approved successfully!");
    } catch (error) {
      console.error(error);
      alert("Error approving partner");
    }
  };

  const rejectAndDeletePartner = async (id) => {
    if (!window.confirm("Are you sure you want to reject and delete this partner?")) return;
    try {
      // Optional: mark as rejected before deleting
      // await updateDoc(doc(db, "partners", id), { rejected: true });
      
      await deleteDoc(doc(db, "partners", id));
      setPartners(prev => prev.filter(p => p.id !== id));
      alert("Partner rejected and deleted successfully!");
    } catch (error) {
      console.error(error);
      alert("Error rejecting & deleting partner");
    }
  };

  return (
    <div className="page-container">
      <h2>Pending Partners (KYC not approved)</h2>

      {loading && <p>Loading...</p>}

      {!loading && partners.length === 0 && <p>No pending partners</p>}

      {!loading && partners.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Categories</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {partners.map(p => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.email}</td>
                <td>{p.phone}</td>
                <td>{p.categories && p.categories.length > 0 ? p.categories.join(", ") : "No categories"}</td>
                <td>
                  <button 
                    onClick={() => approvePartner(p.id)} 
                    style={{ marginRight: "5px", background: "#4CAF50", color: "#fff" }}
                  >
                    Approve
                  </button>
                  <button 
                    onClick={() => rejectAndDeletePartner(p.id)} 
                    style={{ background: "#e74c3c", color: "#fff" }}
                  >
                    Reject & Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PendingPartners;
