import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';

export default function DiceRollerScreen({ isVisible, targetNumber, onClose }) {
  const [rollResult, setRollResult] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [localTargetNumber, setLocalTargetNumber] = useState(targetNumber || '50');
  const [canFlipToSuccess, setCanFlipToSuccess] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setRollResult(null);
      setIsFlipped(false);
      setCanFlipToSuccess(false);
      setLocalTargetNumber(targetNumber);
    }
  }, [isVisible, targetNumber]);

  const rollDice = () => {
    const result = Math.floor(Math.random() * 100) + 1;
    setRollResult(result);
    setIsFlipped(false);
    checkFlipToSuccess(result);
  };

  const flipResult = () => {
    if (rollResult !== null) {
      const flipped = parseInt(rollResult.toString().padStart(2, '0').split('').reverse().join(''), 10);
      setRollResult(flipped);
      setIsFlipped(true);
    }
  };

  const checkFlipToSuccess = (result) => {
    const flipped = parseInt(result.toString().padStart(2, '0').split('').reverse().join(''), 10);
    setCanFlipToSuccess(
      result > parseInt(localTargetNumber) && flipped <= parseInt(localTargetNumber)
    );
  };

  const isCriticalSuccess = (result) => result <= parseInt(localTargetNumber) && isDouble(result);
  const isCriticalFailure = (result) => result > parseInt(localTargetNumber) && isDouble(result);

  const isDouble = (number) => {
    const numStr = number.toString().padStart(2, '0');
    return numStr[0] === numStr[1];
  };

  const renderResultMessage = () => {
    if (rollResult === null) return 'Roll to see results';
    if (isCriticalSuccess(rollResult)) return '🌟 Critical Success! 🌟';
    if (rollResult <= parseInt(localTargetNumber)) return '✅ Success';
    if (isCriticalFailure(rollResult)) return '💀 Critical Failure! 💀';
    return '❌ Failure';
  };

  return (
    <Modal visible={isVisible} transparent={true} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.header}>🎲Dice Roller🎲</Text>
          <Text style={styles.label}>Target Number: {localTargetNumber}</Text>
          <TouchableOpacity style={styles.resultContainer} onPress={rollDice}>
            <Text style={styles.resultText}>
              {rollResult !== null ? rollResult : '--'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.resultMessage}>{renderResultMessage()}</Text>
          <TouchableOpacity style={[styles.button, styles.buttonActive]} onPress={rollDice}>
            <Text style={styles.buttonText}>Roll Dice</Text>
          </TouchableOpacity>
          {canFlipToSuccess && !isFlipped && (
            <TouchableOpacity
              style={[styles.button, styles.buttonActive]}
              onPress={flipResult}
            >
              <Text style={styles.buttonText}>✨ Spend Faith to Succeed ✨</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={[styles.button, styles.closeButton]} onPress={onClose}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    backgroundColor: '#301a19',
    padding: 20,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#692210',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    color: '#dfddd3',
    marginBottom: 16,
    fontFamily: 'SpaceGrotesk_700Bold',
    textShadowColor: '#692210',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
  },
  label: {
    fontSize: 16,
    color: '#dfddd3',
    marginBottom: 8,
    fontFamily: 'SpaceGrotesk_400Regular',
  },
  resultContainer: {
    width: 120,
    height: 120,
    backgroundColor: '#535d75',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#692210',
  },
  resultText: {
    fontSize: 42,
    color: '#dfddd3',
    fontFamily: 'SpaceGrotesk_700Bold',
    textShadowColor: '#301a19',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  resultMessage: {
    fontSize: 18,
    color: '#dfddd3',
    marginBottom: 16,
    fontFamily: 'SpaceGrotesk_400Regular',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#692210',
  },
  buttonActive: {
    backgroundColor: '#535d75',
  },
  buttonDisabled: {
    backgroundColor: '#5d6363',
  },
  buttonText: {
    fontSize: 16,
    color: '#dfddd3',
    fontFamily: 'SpaceGrotesk_700Bold',
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#301a19',
    marginTop: 10,
  },
});
