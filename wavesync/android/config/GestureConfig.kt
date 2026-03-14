package com.wavesync.app.config

/**
 * GestureAction: Data class to store user-defined functions.
 * Allows DJs or Disabled users to program repeated actions.
 */
data class GestureAction(
    val gestureType: GestureType,
    val actionName: String,
    val payload: String // Could be a JSON payload or REST endpoint
)

enum class GestureType {
    SINGLE_WAVE,
    DOUBLE_WAVE,
    HOLD_HOVER
}

class GestureProfileManager {
    private val savedGestures = mutableMapOf<GestureType, GestureAction>()

    fun saveGesture(gesture: GestureAction) {
        savedGestures[gesture.gestureType] = gesture
    }

    fun getActionFor(type: GestureType): GestureAction? {
        return savedGestures[type]
    }

    // Default configuration for initial setup
    fun loadDefaults() {
        saveGesture(GestureAction(GestureType.SINGLE_WAVE, "Rewind 15s", "Rev"))
        saveGesture(GestureAction(GestureType.DOUBLE_WAVE, "Play/Pause Toggle", "Play"))
        saveGesture(GestureAction(GestureType.HOLD_HOVER, "Mute Audio", "Mute"))
    }
}
