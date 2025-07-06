import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import ReviewSystem from './contracts/ReviewSystem.json';

const contractAddress = "0x4c6Fc3a344dce7B82eD63E1265f5770810e6fd33";

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [productId, setProductId] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(1);
  const [allReviews, setAllReviews] = useState([]);
  const [searchProductId, setSearchProductId] = useState('');

  // Connect to MetaMask and contract
  useEffect(() => {
    const loadBlockchain = async () => {
      try {
        if (window.ethereum) {
          const provider = new ethers.BrowserProvider(window.ethereum);
          
          // Request account access
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          setAccount(accounts[0]);
          console.log("Connected account:", accounts[0]);

          const signer = await provider.getSigner();
          const network = await provider.getNetwork();
          console.log("Connected to network:", network);

          const contractInstance = new ethers.Contract(
            contractAddress,
            ReviewSystem.abi,
            signer
          );
          setContract(contractInstance);
          console.log("Connected to contract:", contractInstance);

          // Test contract connection
          try {
            const testCall = await contractInstance.getAverageRating("test");
            console.log("Contract connection test successful");
          } catch (testErr) {
            console.warn("Contract test call failed:", testErr);
          }

        } else {
          alert("Please install MetaMask to use this DApp");
        }
      } catch (error) {
        console.error("Error loading blockchain:", error);
        alert("Failed to connect to blockchain: " + error.message);
      }
    };

    loadBlockchain();
  }, []);

  const handleSubmit = async () => {
    if (!productId || !comment || !rating) {
      alert("Please fill in all fields");
      return;
    }

    if (!contract) {
      alert("Contract not connected. Please refresh the page and ensure MetaMask is connected.");
      return;
    }

    try {
      console.log("Submitting review with:", { productId, comment, rating });
      console.log("Contract instance:", contract);
      
      // Check if the user has already reviewed this product
      const hasUserReviewed = await contract.hasReviewed(account, productId);
      if (hasUserReviewed) {
        alert("You have already reviewed this product!");
        return;
      }

      const tx = await contract.submitReview(productId, comment, rating);
      console.log("Transaction sent:", tx.hash);
      
      alert("Transaction sent! Waiting for confirmation...");
      await tx.wait();
      
      alert("Review submitted successfully!");
      setProductId('');
      setComment('');
      setRating(1);
      
      // Refresh reviews if we're viewing the same product
      if (searchProductId === productId) {
        loadReviews(productId);
      }
    } catch (err) {
      console.error("Detailed error:", err);
      
      let errorMessage = "Failed to submit review: ";
      
      if (err.code === 4001) {
        errorMessage += "Transaction rejected by user";
      } else if (err.code === -32603) {
        errorMessage += "Internal JSON-RPC error. Check if Ganache is running.";
      } else if (err.reason) {
        errorMessage += err.reason;
      } else if (err.message) {
        errorMessage += err.message;
      } else {
        errorMessage += "Unknown error occurred";
      }
      
      alert(errorMessage);
    }
  };

  const loadReviews = async (productIdToSearch) => {
    if (!contract || !productIdToSearch) return;
    try {
      const reviews = await contract.getReviews(productIdToSearch);
      setAllReviews(reviews);
      setSearchProductId(productIdToSearch);
    } catch (err) {
      console.error("Error loading reviews:", err);
      alert("Failed to load reviews");
    }
  };

  // Helper function to generate consistent gradient colors based on wallet address
  function getRandomGradient(address, secondary = false) {
    const colors = [
      '#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe',
      '#43e97b', '#38f9d7', '#fbbf24', '#f59e0b', '#ef4444', '#dc2626',
      '#8b5cf6', '#7c3aed', '#06b6d4', '#0891b2', '#10b981', '#059669'
    ];
    const index = parseInt(address.slice(2, 4), 16) % colors.length;
    return secondary ? colors[(index + 1) % colors.length] : colors[index];
  }

  return (
    <div style={{ 
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", 
      backgroundColor: '#f8fafc', 
      minHeight: '100vh',
      margin: 0,
      padding: 0
    }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px 0',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '15px'
          }}>
            <div>
              <h1 style={{ 
                color: 'white', 
                margin: 0, 
                fontSize: 'clamp(20px, 4vw, 28px)', 
                fontWeight: '700',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}>
                🔗 BlockReview
              </h1>
              <p style={{ 
                color: 'rgba(255,255,255,0.9)', 
                margin: '5px 0 0 0', 
                fontSize: 'clamp(12px, 2vw, 14px)',
                fontWeight: '300'
              }}>
                Decentralized Product Review System
              </p>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.15)',
              padding: '12px 20px',
              borderRadius: '25px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
              minWidth: '200px'
            }}>
              <div style={{ color: 'white', fontSize: '12px', opacity: 0.8 }}>Connected Wallet</div>
              <div style={{ 
                color: 'white', 
                fontWeight: '600', 
                fontSize: '14px',
                fontFamily: 'monospace',
                wordBreak: 'break-all'
              }}>
                {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : "Not connected"}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 20px' }}>
        
        {/* Dashboard Stats */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '20px', 
          marginBottom: '30px' 
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '25px',
            borderRadius: '15px',
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
            transition: 'transform 0.3s ease'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>📝</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>Submit Review</div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Share your product experience</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white',
            padding: '25px',
            borderRadius: '15px',
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(240, 147, 251, 0.3)',
            transition: 'transform 0.3s ease'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>🔍</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>Search Reviews</div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Find product feedback</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white',
            padding: '25px',
            borderRadius: '15px',
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(79, 172, 254, 0.3)',
            transition: 'transform 0.3s ease'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>⛓️</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>Blockchain</div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Transparent & immutable</div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
          gap: '30px', 
          marginBottom: '30px'
        }}>
          
          {/* Submit Review Section */}
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '30px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '25px' }}>
              <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                width: '50px',
                height: '50px',
                borderRadius: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                marginRight: '15px'
              }}>
                📝
              </div>
              <div>
                <h3 style={{ margin: 0, color: '#2d3748', fontSize: '20px', fontWeight: '600' }}>
                  Submit New Review
                </h3>
                <p style={{ margin: '5px 0 0 0', color: '#718096', fontSize: '14px' }}>
                  Share your honest product experience
                </p>
              </div>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  color: '#4a5568', 
                  fontSize: '14px', 
                  fontWeight: '600' 
                }}>
                  Product ID
                </label>
                <input
                  type="text"
                  placeholder="e.g., product-001, laptop-dell-xps13"
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: '2px solid #e2e8f0',
                    fontSize: '14px',
                    transition: 'all 0.3s ease',
                    outline: 'none',
                    backgroundColor: '#f8fafc',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  color: '#4a5568', 
                  fontSize: '14px', 
                  fontWeight: '600' 
                }}>
                  Your Review
                </label>
                <textarea
                  rows="4"
                  placeholder="Write your detailed review here... What did you like? What could be improved?"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: '2px solid #e2e8f0',
                    fontSize: '14px',
                    resize: 'vertical',
                    transition: 'all 0.3s ease',
                    outline: 'none',
                    backgroundColor: '#f8fafc',
                    minHeight: '100px',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>

              <div style={{ marginBottom: '25px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  color: '#4a5568', 
                  fontSize: '14px', 
                  fontWeight: '600' 
                }}>
                  Rating
                </label>
                <select
                  value={rating}
                  onChange={(e) => setRating(parseInt(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: '2px solid #e2e8f0',
                    fontSize: '14px',
                    backgroundColor: '#f8fafc',
                    outline: 'none',
                    cursor: 'pointer',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value={1}>⭐ 1 - Poor</option>
                  <option value={2}>⭐⭐ 2 - Fair</option>
                  <option value={3}>⭐⭐⭐ 3 - Good</option>
                  <option value={4}>⭐⭐⭐⭐ 4 - Very Good</option>
                  <option value={5}>⭐⭐⭐⭐⭐ 5 - Excellent</option>
                </select>
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '15px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.6)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
                }}
              >
                🚀 Submit Review to Blockchain
              </button>
            </form>
          </div>

          {/* Search Reviews Section */}
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '30px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '25px' }}>
              <div style={{
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: 'white',
                width: '50px',
                height: '50px',
                borderRadius: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                marginRight: '15px'
              }}>
                🔍
              </div>
              <div>
                <h3 style={{ margin: 0, color: '#2d3748', fontSize: '20px', fontWeight: '600' }}>
                  Search Reviews
                </h3>
                <p style={{ margin: '5px 0 0 0', color: '#718096', fontSize: '14px' }}>
                  Find reviews for any product
                </p>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                color: '#4a5568', 
                fontSize: '14px', 
                fontWeight: '600' 
              }}>
                Product ID
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  placeholder="Enter Product ID to search"
                  value={searchProductId}
                  onChange={(e) => setSearchProductId(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: '2px solid #e2e8f0',
                    fontSize: '14px',
                    transition: 'all 0.3s ease',
                    outline: 'none',
                    backgroundColor: '#f8fafc',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#f093fb'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
                <button
                  onClick={() => loadReviews(searchProductId)}
                  style={{
                    padding: '12px 20px',
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(240, 147, 251, 0.4)',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 25px rgba(240, 147, 251, 0.6)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 15px rgba(240, 147, 251, 0.4)';
                  }}
                >
                  🔍 Search
                </button>
              </div>
            </div>

            {/* Quick Search Suggestions */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '12px', color: '#718096', marginBottom: '8px' }}>
                Quick search examples:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {['product-001', 'laptop-dell', 'phone-iphone', 'book-react'].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      setSearchProductId(suggestion);
                      loadReviews(suggestion);
                    }}
                    style={{
                      padding: '6px 12px',
                      background: '#f7fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '20px',
                      fontSize: '12px',
                      color: '#4a5568',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background = '#ed64a6';
                      e.target.style.color = 'white';
                      e.target.style.borderColor = '#ed64a6';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = '#f7fafc';
                      e.target.style.color = '#4a5568';
                      e.target.style.borderColor = '#e2e8f0';
                    }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Results Info */}
            {searchProductId && (
              <div style={{
                background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
                padding: '15px',
                borderRadius: '10px',
                border: '1px solid #c7d2fe'
              }}>
                <div style={{ fontSize: '14px', color: '#3730a3', fontWeight: '600' }}>
                  📊 Searching for: "{searchProductId}"
                </div>
                <div style={{ fontSize: '12px', color: '#5b21b6', marginTop: '5px' }}>
                  {allReviews.length} review(s) found
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Display Section */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '30px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '25px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              color: 'white',
              width: '50px',
              height: '50px',
              borderRadius: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              marginRight: '15px'
            }}>
              📃
            </div>
            <div>
              <h3 style={{ margin: 0, color: '#2d3748', fontSize: '20px', fontWeight: '600' }}>
                Product Reviews {searchProductId && `for "${searchProductId}"`}
              </h3>
              <p style={{ margin: '5px 0 0 0', color: '#718096', fontSize: '14px' }}>
                {allReviews.length > 0 
                  ? `Showing ${allReviews.length} review${allReviews.length !== 1 ? 's' : ''}`
                  : searchProductId 
                    ? 'No reviews found for this product' 
                    : 'Search for a product to see reviews'
                }
              </p>
            </div>
          </div>

          {allReviews.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: '#a0aec0',
              background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
              borderRadius: '15px',
              border: '2px dashed #e2e8f0'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>
                {searchProductId ? '📭' : '🔍'}
              </div>
              <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '10px', color: '#4a5568' }}>
                {searchProductId ? 'No reviews found' : 'Ready to search'}
              </div>
              <div style={{ fontSize: '14px' }}>
                {searchProductId 
                  ? 'This product hasn\'t been reviewed yet. Be the first to share your experience!' 
                  : 'Enter a product ID above to view blockchain-verified reviews'
                }
              </div>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gap: '20px',
              maxHeight: '600px',
              overflowY: 'auto',
              paddingRight: '10px'
            }}>
              {allReviews.map((review, i) => (
                <div key={i} style={{
                  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                  padding: '25px',
                  borderRadius: '15px',
                  border: '1px solid #e2e8f0',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                      <div style={{
                        background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                        color: 'white',
                        padding: '8px 15px',
                        borderRadius: '25px',
                        fontSize: '14px',
                        fontWeight: '600',
                        boxShadow: '0 4px 15px rgba(251, 191, 36, 0.3)',
                        whiteSpace: 'nowrap'
                      }}>
                        {'⭐'.repeat(Number(review.rating))} {review.rating}/5
                      </div>
                      <div style={{
                        background: '#e0e7ff',
                        color: '#3730a3',
                        padding: '4px 12px',
                        borderRadius: '15px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        Verified Purchase
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>
                        {new Date(Number(review.timestamp) * 1000).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                      <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>
                        {new Date(Number(review.timestamp) * 1000).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>

                  <div style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '12px',
                    marginBottom: '15px',
                    border: '1px solid #f1f5f9',
                    lineHeight: '1.6'
                  }}>
                    <p style={{ 
                      margin: 0, 
                      color: '#374151', 
                      fontSize: '15px',
                      fontStyle: review.comment.length > 100 ? 'normal' : 'italic'
                    }}>
                      "{review.comment}"
                    </p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${getRandomGradient(review.reviewer)} 0%, ${getRandomGradient(review.reviewer, true)} 100%)`,
                        marginRight: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: 'bold'
                      }}>
                        {review.reviewer.slice(2, 4).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>
                          Reviewer
                        </div>
                        <div style={{ 
                          fontSize: '13px', 
                          color: '#374151', 
                          fontFamily: 'monospace',
                          fontWeight: '600'
                        }}>
                          {review.reviewer.slice(0, 8)}...{review.reviewer.slice(-6)}
                        </div>
                      </div>
                    </div>
                    
                    <div style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: 'white',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '11px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}>
                      ⛓️ On-Chain
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          marginTop: '50px',
          padding: '30px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '20px',
          textAlign: 'center',
          color: 'white'
        }}>
          <div style={{ fontSize: '24px', marginBottom: '15px' }}>🔗</div>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '18px', fontWeight: '600' }}>
            Powered by Blockchain Technology
          </h4>
          <p style={{ margin: 0, fontSize: '14px', opacity: 0.9, lineHeight: '1.5' }}>
            All reviews are permanently stored on the blockchain, ensuring transparency, 
            immutability, and trust in every product review.
          </p>
          <div style={{ marginTop: '20px', fontSize: '12px', opacity: 0.7 }}>
            Built with Ethereum • Hardhat • React • MetaMask
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;