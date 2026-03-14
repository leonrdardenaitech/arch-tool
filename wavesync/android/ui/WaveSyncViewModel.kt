package com.wavesync.app.ui

import androidx.lifecycle.ViewModel
import com.wavesync.app.hardware.ProximityListener
import com.wavesync.app.network.SmartTvController
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow

/**
 * WaveSyncViewModel: The reactive bridge between hardware and UI.
 */
class WaveSyncViewModel(
    private val proximityListener: ProximityListener
) : ViewModel() {

    private val _isSensorActive = MutableStateFlow(false)
    val isSensorActive: StateFlow<Boolean> = _isSensorActive

    private var currentController: SmartTvController? = null

    fun setController(controller: SmartTvController) {
        this.currentController = controller
    }

    fun toggleSensor() {
        if (_isSensorActive.value) {
            proximityListener.stopListening()
            _isSensorActive.value = false
        } else {
            proximityListener.startListening()
            _isSensorActive.value = true
        }
    }

    fun handleGesture(waveCount: Int) {
        // Map gestures to controller actions
        when (waveCount) {
            1 -> currentController?.rewind()
            2 -> currentController?.playPause()
            3 -> currentController?.mute()
        }
    }

    override fun onCleared() {
        super.onCleared()
        proximityListener.stopListening()
    }
}
