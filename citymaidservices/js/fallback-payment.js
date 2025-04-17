/**
 * Fallback Payment System for City Maid Services
 * This provides a simple payment mechanism when the primary payment system is unavailable
 */

class FallbackPaymentSystem {
    constructor() {
        this.supabaseUrl = 'https://fdgqqxyyofjnkhswkwcq.supabase.co';
        this.supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkZ3FxeHl5b2Zqbmtoc3drd2NxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwMjQyMTMsImV4cCI6MjA1OTYwMDIxM30.YyJLLu3r2a7Mh7ny0ie-YzzLfPh5PdrJJHnBFBxWqVE';
        this.supabaseClient = window.supabase.createClient(this.supabaseUrl, this.supabaseKey);
    }

    /**
     * Process a payment using the fallback system
     * @param {number} amount - The amount to charge
     * @param {string} description - Description of the payment
     * @param {Function} callback - Callback function with success/error handlers
     */
    async processPayment(amount, description, callback) {
        try {
            // Get current user
            const { data: { user }, error: userError } = await this.supabaseClient.auth.getUser();
            if (userError) throw userError;
            
            if (!user) {
                throw new Error('User not authenticated');
            }

            // In a real implementation, this would integrate with a payment gateway
            // For demo purposes, we'll simulate a successful payment
            
            // Generate a transaction ID
            const transactionId = 'FB' + Date.now();
            
            // Simulate payment processing delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Record the payment
            const paymentData = {
                user_id: user.id,
                amount: amount,
                transaction_id: transactionId,
                payment_method: 'fallback',
                status: 'completed',
                description: description,
                created_at: new Date().toISOString()
            };

            console.log('Fallback payment recorded:', paymentData);

            // In a real implementation, this would be:
            // const { data, error } = await this.supabaseClient
            //     .from('payments')
            //     .insert([paymentData]);
            
            // Call success callback
            if (callback && callback.onSuccess) {
                callback.onSuccess({
                    success: true,
                    transaction_id: transactionId,
                    amount: amount
                });
            }
            
            return paymentData;
        } catch (error) {
            console.error('Fallback payment error:', error);
            if (callback && callback.onError) {
                callback.onError(error);
            }
            throw error;
        }
    }

    /**
     * Unlock a contact using the fallback payment system
     * @param {string} maidId - The ID of the maid to unlock
     * @param {Function} callback - Callback function with success/error handlers
     */
    async unlockContact(maidId, callback) {
        try {
            // Get current user
            const { data: { user }, error: userError } = await this.supabaseClient.auth.getUser();
            if (userError) throw userError;
            
            if (!user) {
                throw new Error('User not authenticated');
            }

            // Check if contact is already unlocked
            const isUnlocked = await this.checkIfContactUnlocked(user.id, maidId);
            if (isUnlocked) {
                if (callback && callback.onAlreadyUnlocked) {
                    callback.onAlreadyUnlocked();
                }
                return;
            }

            // Process payment for unlocking contact
            const amount = 5; // $5 to unlock contact
            const description = `Unlock contact for maid ${maidId}`;

            await this.processPayment(amount, description, {
                onSuccess: async (response) => {
                    // Record the unlocked contact
                    await this.recordUnlockedContact(user.id, maidId, response.transaction_id);
                    
                    if (callback && callback.onSuccess) {
                        callback.onSuccess(response);
                    }
                },
                onError: (error) => {
                    if (callback && callback.onError) {
                        callback.onError(error);
                    }
                }
            });
        } catch (error) {
            console.error('Error unlocking contact with fallback system:', error);
            if (callback && callback.onError) {
                callback.onError(error);
            }
        }
    }

    /**
     * Check if a contact is already unlocked
     * @param {string} userId - The user ID
     * @param {string} maidId - The maid ID
     * @returns {Promise<boolean>} - Whether the contact is already unlocked
     */
    async checkIfContactUnlocked(userId, maidId) {
        try {
            // In a real implementation, this would check the unlocked_contacts table
            // For now, we'll just return false
            return false;
        } catch (error) {
            console.error('Error checking unlocked contact:', error);
            return false;
        }
    }

    /**
     * Record an unlocked contact
     * @param {string} userId - The user ID
     * @param {string} maidId - The maid ID
     * @param {string} transactionId - The transaction ID
     * @returns {Promise<Object>} - The recorded contact data
     */
    async recordUnlockedContact(userId, maidId, transactionId) {
        try {
            // In a real implementation, this would save to an unlocked_contacts table
            // For now, we'll just log the data
            const unlockedContactData = {
                user_id: userId,
                maid_id: maidId,
                transaction_id: transactionId,
                unlocked_at: new Date().toISOString()
            };

            console.log('Unlocked contact recorded:', unlockedContactData);

            // In a real implementation, this would be:
            // const { data, error } = await this.supabaseClient
            //     .from('unlocked_contacts')
            //     .insert([unlockedContactData]);
            
            return unlockedContactData;
        } catch (error) {
            console.error('Error recording unlocked contact:', error);
            throw error;
        }
    }
}

// Export the FallbackPaymentSystem class
window.FallbackPaymentSystem = FallbackPaymentSystem; 