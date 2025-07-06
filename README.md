# 🔗 BlockReview - Decentralized Product Review System

A modern, blockchain-based product review system built with Ethereum, Solidity, React, and MetaMask integration. This DApp allows users to submit and view transparent, immutable product reviews stored permanently on the blockchain.

![BlockReview Dashboard](screenshots/dashboard.png)

## 🚀 Features

- **🔗 Blockchain-Based**: All reviews are stored permanently on Ethereum blockchain
- **⭐ Star Rating System**: 1-5 star ratings for detailed feedback
- **🔍 Product Search**: Find reviews for specific products by ID
- **👤 User Authentication**: MetaMask wallet integration
- **🛡️ Duplicate Prevention**: Users can only review each product once
- **📱 Responsive Design**: Modern UI that works on all devices
- **⚡ Real-time Updates**: Live transaction status and confirmations
- **🎨 Modern Interface**: Beautiful gradient design with smooth animations

## 🏗️ Project Structure

```text
AsmaBlockchain/
├── blockchain-review/          # Smart contracts and blockchain backend
│   ├── contracts/             # Solidity smart contracts
│   │   ├── ReviewSystem.sol   # Main review contract
│   │   └── Lock.sol          # Example contract
│   ├── scripts/              # Deployment scripts
│   ├── test/                 # Contract tests
│   ├── hardhat.config.js     # Hardhat configuration
│   └── package.json          # Backend dependencies
├── review-dapp/              # React frontend application
│   ├── src/                  # React source code
│   │   ├── App.js           # Main application component
│   │   ├── contracts/       # Contract ABIs
│   │   └── ...              # Other React files
│   ├── public/              # Static assets
│   └── package.json         # Frontend dependencies
└── screenshots/             # Project screenshots
```

## 🛠️ Technology Stack

### Blockchain

- **Solidity** - Smart contract development
- **Hardhat** - Ethereum development environment
- **Ganache** - Local blockchain for development
- **ethers.js** - Ethereum JavaScript library

### Frontend

- **React.js** - Frontend framework
- **JavaScript (ES6+)** - Programming language
- **CSS-in-JS** - Modern styling approach
- **MetaMask** - Wallet integration

## 📦 Prerequisites

Before running this project, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MetaMask](https://metamask.io/) browser extension
- [Ganache CLI](https://github.com/trufflesuite/ganache) for local blockchain

```bash
# Install Ganache CLI globally
npm install -g ganache-cli
```

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/AsmaBlockchain.git
cd AsmaBlockchain
```

### 2. Install Dependencies

```bash
# Install blockchain dependencies
cd blockchain-review
npm install

# Install frontend dependencies
cd ../review-dapp
npm install
```

### 3. Start Local Blockchain

```bash
# Start Ganache (local Ethereum blockchain)
ganache-cli
```

Keep this terminal open. Ganache will provide you with:

- 10 test accounts with 100 ETH each
- RPC Server URL (usually `http://127.0.0.1:8545`)
- Network ID: 1337

### 4. Deploy Smart Contracts

```bash
# In a new terminal, navigate to blockchain-review
cd blockchain-review

# Deploy contracts to local network
npx hardhat run scripts/deploy.js --network localhost
```

**Important**: Copy the deployed contract address from the output and update it in `review-dapp/src/App.js` at line 6:

```javascript
const contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
```

### 5. Configure MetaMask

1. Open MetaMask browser extension
2. Add a new network with these settings:
   - **Network Name**: Ganache Local
   - **RPC URL**: `http://127.0.0.1:8545`
   - **Chain ID**: 1337
   - **Currency Symbol**: ETH

3. Import a test account using a private key from Ganache

### 6. Start the Frontend

```bash
# Navigate to frontend directory
cd review-dapp

# Start React development server
npm start
```

The application will open at `http://localhost:3000`

## 🎯 How to Use

### Submitting a Review

1. **Connect MetaMask**: Ensure your wallet is connected
2. **Enter Product ID**: Use any identifier (e.g., "laptop-dell-xps13")
3. **Write Review**: Share your honest product experience
4. **Select Rating**: Choose 1-5 stars
5. **Submit**: Confirm the transaction in MetaMask

### Searching Reviews

1. **Enter Product ID**: Type the product identifier
2. **Click Search**: View all reviews for that product
3. **Quick Search**: Use suggested product IDs for testing

### Review Features

- **Verified Reviews**: All reviews are blockchain-verified
- **User Avatars**: Unique avatars generated from wallet addresses
- **Timestamps**: See when each review was submitted
- **Ratings**: Visual star ratings for easy comparison
- **Immutable**: Reviews cannot be deleted or modified

## 🧪 Testing

### Smart Contract Tests

```bash
cd blockchain-review
npx hardhat test
```

### Frontend Testing

```bash
cd review-dapp
npm test
```

## 📝 Smart Contract Details

### ReviewSystem.sol Functions

- `submitReview(string productId, string comment, uint8 rating)` - Submit a new review
- `getReviews(string productId)` - Get all reviews for a product
- `hasReviewed(address user, string productId)` - Check if user reviewed a product
- `getAverageRating(string productId)` - Get average rating for a product

### Events

- `ReviewSubmitted(address reviewer, string productId, string comment, uint8 rating, uint256 timestamp)`

## 🎨 UI Features

- **Modern Dashboard**: Clean, professional interface
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Gradient Styling**: Beautiful color schemes and animations
- **Real-time Feedback**: Live transaction status updates
- **Search Functionality**: Easy product discovery
- **Blockchain Indicators**: Clear on-chain verification badges

## 🔧 Development

### Adding New Features

1. **Smart Contract**: Modify `blockchain-review/contracts/ReviewSystem.sol`
2. **Frontend**: Update `review-dapp/src/App.js`
3. **Redeploy**: Run deployment script and update contract address

### Environment Variables

Create `.env` files for sensitive configuration:

```bash
# blockchain-review/.env
PRIVATE_KEY=your_private_key_here
INFURA_PROJECT_ID=your_infura_id_here
```

## 🚀 Deployment

### Testnet Deployment

1. **Configure Network**: Update `hardhat.config.js` with testnet settings
2. **Deploy Contract**: `npx hardhat run scripts/deploy.js --network goerli`
3. **Update Frontend**: Set new contract address in React app
4. **Build Frontend**: `npm run build` in review-dapp directory

### Production Deployment

- **Frontend**: Deploy to Vercel, Netlify, or GitHub Pages
- **Smart Contract**: Deploy to Ethereum mainnet
- **IPFS**: Consider storing larger data on IPFS

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Hardhat](https://hardhat.org/) - Ethereum development environment
- [React](https://reactjs.org/) - Frontend framework
- [MetaMask](https://metamask.io/) - Wallet integration
- [ethers.js](https://docs.ethers.io/) - Ethereum library
- [Ganache](https://trufflesuite.com/ganache/) - Local blockchain

## 📞 Support

If you have any questions or issues, please:

1. Check the [Issues](https://github.com/yourusername/AsmaBlockchain/issues) page
2. Create a new issue with detailed information
3. Contact the maintainers

---

**Built with ❤️ by [Your Name]**

> Empowering transparent product reviews through blockchain technology
