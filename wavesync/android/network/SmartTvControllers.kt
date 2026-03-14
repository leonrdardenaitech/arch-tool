package com.wavesync.app.network

import java.net.HttpURLConnection
import java.net.URL
import android.util.Log

/**
 * Strategy Pattern: Interface for all smart device controllers.
 */
interface SmartTvController {
    fun playPause()
    fun rewind()
    fun mute()
}

/**
 * Roku Implementation: Uses RESTful POST requests.
 */
class RokuController(private val ipAddress: String) : SmartTvController {
    override fun rewind() = sendCommand("keypress/Rev")
    override fun playPause() = sendCommand("keypress/Play")
    override fun mute() = sendCommand("keypress/VolumeMute")

    private fun sendCommand(endpoint: String) {
        Thread {
            try {
                val url = URL("http://$ipAddress:8060/$endpoint")
                with(url.openConnection() as HttpURLConnection) {
                    requestMethod = "POST"
                    connectTimeout = 1000
                    inputStream.use { it.read() }
                }
            } catch (e: Exception) {
                Log.e("WaveSync", "Roku Payload Failed: ${e.message}")
            }
        }.start()
    }
}

/**
 * Google Cast Implementation: Uses JSON over WebSockets/Protobuf.
 * (Skeleton implementation for portfolio architecture demonstration)
 */
class ChromecastController(private val ipAddress: String) : SmartTvController {
    override fun playPause() = Log.d("WaveSync", "CAST: Sending PLAY/PAUSE JSON to $ipAddress")
    override fun rewind() = Log.d("WaveSync", "CAST: Sending SEEK -15s JSON to $ipAddress")
    override fun mute() = Log.d("WaveSync", "CAST: Sending MUTE JSON to $ipAddress")
}
