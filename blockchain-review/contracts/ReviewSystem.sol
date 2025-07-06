// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ReviewSystem {

    struct Review {
        address reviewer;
        string comment;
        uint8 rating;
        uint timestamp;
    }

    mapping(string => Review[]) public productReviews;
    mapping(address => mapping(string => bool)) public hasReviewed;

    event ReviewSubmitted(address reviewer, string productId, uint8 rating, string comment);

    function submitReview(string memory productId, string memory comment, uint8 rating) public {
        require(rating >= 1 && rating <= 5, "Rating must be between 1 and 5");
        require(!hasReviewed[msg.sender][productId], "You have already reviewed this product");

        Review memory newReview = Review({
            reviewer: msg.sender,
            comment: comment,
            rating: rating,
            timestamp: block.timestamp
        });

        productReviews[productId].push(newReview);
        hasReviewed[msg.sender][productId] = true;

        emit ReviewSubmitted(msg.sender, productId, rating, comment);
    }

    function getAverageRating(string memory productId) public view returns (uint) {
        Review[] memory reviews = productReviews[productId];
        uint total = 0;

        for (uint i = 0; i < reviews.length; i++) {
            total += reviews[i].rating;
        }

        if (reviews.length == 0) {
            return 0;
        }

        return total / reviews.length;
    }

    function getReviews(string memory productId) public view returns (Review[] memory) {
        return productReviews[productId];
    }
}
