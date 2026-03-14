package com.wavesync.app.hardware

import android.content.Context
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import android.util.Log

/**
 * ProximityListener: Interacts with the Android hardware sensor.
 * Implements debouncing logic to prevent gesture 'flutter'.
 */
class ProximityListener(
    context: Context,
    private val onGestureDetected: (Int) -> Unit
) : SensorEventListener {

    private val sensorManager = context.getSystemService(Context.SENSOR_SERVICE) as SensorManager
    private val proximitySensor: Sensor? = sensorManager.getDefaultSensor(Sensor.TYPE_PROXIMITY)

    private val DEBOUNCE_DELAY_MS = 500L
    private var lastWaveTime = 0L
    private var waveCount = 0
    private val gestureWindowMs = 400L

    fun startListening() {
        proximitySensor?.let {
            sensorManager.registerListener(this, it, SensorManager.SENSOR_DELAY_NORMAL)
            Log.d("WaveSync", "Sensor Activated: Listening for macro-gestures.")
        } ?: Log.e("WaveSync", "Hardware Error: No proximity sensor found.")
    }

    fun stopListening() {
        sensorManager.unregisterListener(this)
        Log.d("WaveSync", "Sensor Deactivated: Battery preserved.")
    }

    override fun onSensorChanged(event: SensorEvent?) {
        if (event?.sensor?.type == Sensor.TYPE_PROXIMITY) {
            val distance = event.values[0]
            val isNear = distance < (proximitySensor?.maximumRange ?: 0f)

            if (isNear) {
                val currentTime = System.currentTimeMillis()
                if (currentTime - lastWaveTime > DEBOUNCE_DELAY_MS) {
                    lastWaveTime = currentTime
                    waveCount++
                    
                    // Simple logic to detect multiple waves within a small window
                    Log.d("WaveSync", "Wave incremented: $waveCount")
                    onGestureDetected(waveCount) 
                    
                    // Reset wave count after window closes (Simplified for MVP)
                    // In production, we would use a Handler or Coroutine timer
                }
            }
        }
    }

    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {}
}
