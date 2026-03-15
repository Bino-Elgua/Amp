// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * CASSANDRA ORACLE SMART CONTRACT
 * Immutable record of paradigm predictions and their validation
 */

contract CassandraOracle {
    
    struct PredictionProof {
        string predictionId;
        bytes32 predictionHash;
        bytes32 reasoningHash;
        uint256 confidence;
        uint256 timestamp;
        address predictor;
        bool validated;
        uint256 validationTimestamp;
    }

    struct ParadigmSignal {
        string signalType;
        string description;
        uint256 strength;
        uint256 timestamp;
    }

    // Mapping of prediction ID to proof
    mapping(string => PredictionProof) public predictions;
    
    // Mapping of prediction ID to signals
    mapping(string => ParadigmSignal[]) public signals;
    
    // History of all predictions
    string[] public predictionHistory;
    
    // Events
    event PredictionCommitted(
        string indexed predictionId,
        bytes32 predictionHash,
        uint256 confidence,
        uint256 timestamp
    );
    
    event PredictionValidated(
        string indexed predictionId,
        bool success,
        uint256 timestamp
    );
    
    event SignalRecorded(
        string indexed predictionId,
        string signalType,
        uint256 strength
    );

    constructor() {}

    /**
     * Commit a paradigm prediction to the blockchain
     */
    function commitPrediction(
        string calldata predictionId,
        bytes32 predictionHash,
        bytes32 reasoningHash,
        uint256 confidence
    ) external {
        require(bytes(predictionId).length > 0, "Invalid prediction ID");
        require(confidence > 0 && confidence <= 100, "Invalid confidence");
        require(predictions[predictionId].timestamp == 0, "Prediction already exists");

        PredictionProof memory proof = PredictionProof({
            predictionId: predictionId,
            predictionHash: predictionHash,
            reasoningHash: reasoningHash,
            confidence: confidence,
            timestamp: block.timestamp,
            predictor: msg.sender,
            validated: false,
            validationTimestamp: 0
        });

        predictions[predictionId] = proof;
        predictionHistory.push(predictionId);

        emit PredictionCommitted(predictionId, predictionHash, confidence, block.timestamp);
    }

    /**
     * Record a paradigm signal that contributed to prediction
     */
    function recordSignal(
        string calldata predictionId,
        string calldata signalType,
        string calldata description,
        uint256 strength
    ) external {
        require(predictions[predictionId].timestamp > 0, "Prediction not found");
        require(strength > 0 && strength <= 100, "Invalid signal strength");

        ParadigmSignal memory signal = ParadigmSignal({
            signalType: signalType,
            description: description,
            strength: strength,
            timestamp: block.timestamp
        });

        signals[predictionId].push(signal);
        emit SignalRecorded(predictionId, signalType, strength);
    }

    /**
     * Validate a prediction after paradigm emergence
     */
    function validatePrediction(
        string calldata predictionId,
        bool success
    ) external {
        PredictionProof storage proof = predictions[predictionId];
        require(proof.timestamp > 0, "Prediction not found");
        require(proof.validated == false, "Prediction already validated");

        proof.validated = true;
        proof.validationTimestamp = block.timestamp;

        emit PredictionValidated(predictionId, success, block.timestamp);
    }

    /**
     * Get all signals for a prediction
     */
    function getSignals(string calldata predictionId) 
        external 
        view 
        returns (ParadigmSignal[] memory) 
    {
        return signals[predictionId];
    }

    /**
     * Get prediction proof
     */
    function getPrediction(string calldata predictionId)
        external
        view
        returns (PredictionProof memory)
    {
        return predictions[predictionId];
    }

    /**
     * Get total number of predictions
     */
    function getPredictionCount() external view returns (uint256) {
        return predictionHistory.length;
    }

    /**
     * Get prediction by index
     */
    function getPredictionAtIndex(uint256 index) 
        external 
        view 
        returns (string memory) 
    {
        require(index < predictionHistory.length, "Index out of bounds");
        return predictionHistory[index];
    }

    /**
     * Calculate oracle accuracy
     */
    function getAccuracy() external view returns (uint256) {
        if (predictionHistory.length == 0) return 0;

        uint256 validated = 0;
        for (uint256 i = 0; i < predictionHistory.length; i++) {
            if (predictions[predictionHistory[i]].validated) {
                validated++;
            }
        }

        return (validated * 100) / predictionHistory.length;
    }
}
