package com.wavesync.app.network

import android.content.Context
import android.net.nsd.NsdManager
import android.net.nsd.NsdServiceInfo
import android.util.Log
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow

data class DiscoveredTv(val name: String, val ip: String, val type: String)

/**
 * DeviceScanner: Zero-Configuration networking using mDNS.
 * Proves the ability to handle asynchronous network discovery.
 */
class DeviceScanner(context: Context) {
    private val nsdManager = context.getSystemService(Context.NSD_SERVICE) as NsdManager
    private val _devices = MutableStateFlow<List<DiscoveredTv>>(emptyList())
    val devices: StateFlow<List<DiscoveredTv>> = _devices

    private val discoveryListener = object : NsdManager.DiscoveryListener {
        override fun onServiceFound(serviceInfo: NsdServiceInfo) {
            if (serviceInfo.serviceType.contains("googlecast")) {
                nsdManager.resolveService(serviceInfo, object : NsdManager.ResolveListener {
                    override fun onServiceResolved(info: NsdServiceInfo) {
                        val newTv = DiscoveredTv(info.serviceName, info.host.hostAddress ?: "", "Cast")
                        _devices.value = (_devices.value + newTv).distinctBy { it.ip }
                    }
                    override fun onResolveFailed(info: NsdServiceInfo, error: Int) {}
                })
            }
        }
        override fun onDiscoveryStarted(type: String) = Log.d("WaveSync", "Scan Started")
        override fun onDiscoveryStopped(type: String) = Log.d("WaveSync", "Scan Stopped")
        override fun onStartDiscoveryFailed(type: String, error: Int) = nsdManager.stopServiceDiscovery(this)
        override fun onStopDiscoveryFailed(type: String, error: Int) = nsdManager.stopServiceDiscovery(this)
        override fun onServiceLost(info: NsdServiceInfo) {
            _devices.value = _devices.value.filter { it.name != info.serviceName }
        }
    }

    fun start() {
        nsdManager.discoverServices("_googlecast._tcp.", NsdManager.PROTOCOL_DNS_SD, discoveryListener)
    }

    fun stop() {
        nsdManager.stopServiceDiscovery(discoveryListener)
    }
}
