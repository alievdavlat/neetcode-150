/**
 * 3038. Intergalactic Transmission   ·   Easy   ·   Exercism
 *
 * Your job is to help implement
 *
 * - the transmitter, which calculates the transmission sequence, and
 * - the receiver, which decodes it.
 *
 * A parity bit is simple way of detecting transmission errors. The
 * transmitters and receivers can only transmit and receive exactly eight bits
 * at a time (including the parity bit). The parity bit is set so that there is
 * an even number of 1 bits in each transmission, and the parity bit is always
 * the first bit from the right. So if the receiver receives 11000001, 01110101
 * or 01000000 (i.e. a transmission with an odd number of 1 bits), it knows
 * there is an error.
 *
 * However, messages are rarely this short, and need to be transmitted in a
 * sequence when they are longer.
 *
 * For example, consider the message 11000000 00000001 11000000 11011110 (or C0
 * 01 C0 DE in hex).
 *
 * Since each transmission contains exactly eight bits, it can only contain
 * seven bits of data and the parity bit. A parity bit must then be inserted
 * after every seven bits of data:
 *
 * The transmission sequence for this message looks like this:
 *
 * The data in the first transmission in the sequence (1100000) has two 1 bits
 * (an even number), so the parity bit is 0. The first transmission becomes
 * 11000000 (or C0 in hex).
 *
 * The data in the next transmission (0000000) has zero 1 bits (an even number
 * again), so the parity bit is 0 again. The second transmission thus becomes
 * 00000000 (or 00 in hex).
 *
 * The data
 *
 * Example 1:
 *   Input:  message = []
 *   Output: []
 *
 * Example 2:
 *   Input:  message = ["0x00"]
 *   Output: ["0x00","0x00"]
 *
 * Example 3:
 *   Input:  message = ["0x02"]
 *   Output: ["0x03","0x00"]
 *
 * Example 4:
 *   Input:  message = ["0x06"]
 *   Output: ["0x06","0x00"]
 *
 * Example 5:
 *   Input:  message = ["0x05"]
 *   Output: ["0x05","0x81"]
 *
 * Example 6:
 *   Input:  message = ["0x29"]
 *   Output: ["0x28","0x81"]
 *
 * Pattern:   Read the rule carefully, then write it out
 * Target:    Not stated for this set
 * Source:    Exercism problem specifications · MIT
 */
export function transmitSequence(message: string[]): string[] {
  throw new Error('Not implemented');
}
