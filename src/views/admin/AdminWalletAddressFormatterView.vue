<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getAddress, toHex } from 'viem'
import { BaseButton } from '@/components/ui/button'
import { grantPermissions, type SmartSessionGrantPermissionsRequest } from '@reown/appkit-experimental/smart-session'
import { baseSepolia } from '@reown/appkit/networks'
import { env } from '@/env.ts'

onMounted(async () => {
  await new Promise((resolve) => setTimeout(resolve, 5000))
  const request: SmartSessionGrantPermissionsRequest = {
    expiry: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
    chainId: toHex(baseSepolia.id),
    address: env.contracts.base.tokenAddress,
    signer: {
      type: 'keys',
      data: {
        keys :[{
          type: 'secp256k1',
          publicKey: '0x3183b6eE96D9a7FBF6C21E03F96ba3266f6C14e6', //public key of dapp signer
        }],
      },
    },
    permissions: [ {
      type: 'contract-call',
      data: {
        address: env.contracts.base.tokenAddress, // sample donut contract address
        abi: [
          {
            'inputs': [
              {
                'internalType': 'address',
                'name': 'spender',
                'type': 'address',
              },
              {
                'internalType': 'uint256',
                'name': 'value',
                'type': 'uint256',
              },
            ],
            'name': 'approve',
            'outputs': [
              {
                'internalType': 'bool',
                'name': '',
                'type': 'bool',
              },
            ],
            'stateMutability': 'nonpayable',
            'type': 'function',
          },
        ],
        functions: [ {
          functionName: 'approve',
        } ],
      },
    }],
    policies: [],
  }

  const response = await grantPermissions(request)
  console.dir(response)
  // const r = {
  //   "permissions": [
  //     {
  //       "type": "contract-call",
  //       "data": {
  //         "address": "0xd72e9dac2d304377060357c284e33399417abf57",
  //         "abi": [
  //           {
  //             "inputs": [
  //               {
  //                 "internalType": "address",
  //                 "name": "spender",
  //                 "type": "address"
  //               },
  //               {
  //                 "internalType": "uint256",
  //                 "name": "value",
  //                 "type": "uint256"
  //               }
  //             ],
  //             "name": "approve",
  //             "outputs": [
  //               {
  //                 "internalType": "bool",
  //                 "name": "",
  //                 "type": "bool"
  //               }
  //             ],
  //             "stateMutability": "nonpayable",
  //             "type": "function"
  //           }
  //         ],
  //         "functions": [
  //           {
  //             "functionName": "approve"
  //           }
  //         ]
  //       }
  //     }
  //   ],
  //   "context": "8a6b0faf-ef30-4bdd-93c8-93f8faa8714e",
  //   "expiry": 1739265803,
  //   "address": "0xd72e9dac2d304377060357c284e33399417abf57",
  //   "chainId": "0x14a34"
  // }
})

const wallets = ref('')
const formatted = ref<string[]>([])

function generateQueries() {
  const w = wallets.value.split('\n').filter(Boolean)
  formatted.value = []
  for (const wallet of w) {
    try {
      const formattedWallet = getAddress(wallet)
      formatted.value.push(formattedWallet)
    } catch (_error) {
      formatted.value = [`${wallet}: Invalid wallet address`]
      break
    }
  }

}
</script>

<template>
  <div class="p-10 bg-amber-100">
    <textarea
      v-model="wallets"
      cols="50"
      rows="20"
      style="background-color: white; color: black"
    />
    <div style="background-color: white; color: black;">
      <div
        v-for="w in formatted"
        :key="w"
      >
        {{ w }}
      </div>
    </div>
    <BaseButton @click="generateQueries()">
      Format
    </BaseButton>
  </div>
</template>

<style scoped>

</style>
