// Payment Service for City Maid Services
// Handles Khalti payment integration

class PaymentService {
    constructor() {
        this.supabaseUrl = 'https://fdgqqxyyofjnkhswkwcq.supabase.co';
        this.supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkZ3FxeHl5b2Zqbmtoc3drd2NxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwMjQyMTMsImV4cCI6MjA1OTYwMDIxM30.YyJLLu3r2a7Mh7ny0ie-YzzLfPh5PdrJJHnBFBxWqVE';
        this.supabaseClient = window.supabase.createClient(this.supabaseUrl, this.supabaseKey);
        
        // Khalti configuration
        this.khaltiPublicKey = 'test_public_key_dc74e0fd57cb46cd93832aee0a390234'; // Replace with your actual public key
        this.khaltiEndpoint = 'https://khalti.com/api/v2/payment/verify/';
        this.khaltiInitialized = false;
        this.initializeKhalti();
    }

    // Initialize Khalti checkout
    initializeKhalti() {
        try {
            // Check if KhaltiCheckout is available
            if (typeof KhaltiCheckout === 'undefined') {
                console.error('KhaltiCheckout is not available');
                this.khaltiInitialized = false;
                return false;
            }
            
            // Test initialization
            const testConfig = {
                publicKey: this.khaltiPublicKey,
                productIdentity: 'test',
                productName: 'test',
                productUrl: window.location.origin,
                eventHandler: {
                    onSuccess: () => {},
                    onError: () => {},
                    onClose: () => {}
                }
            };
            
            // Try to create a test instance
            new KhaltiCheckout(testConfig);
            this.khaltiInitialized = true;
            console.log('Khalti initialized successfully');
            return true;
        } catch (error) {
            console.error('Failed to initialize Khalti:', error);
            this.khaltiInitialized = false;
            return false;
        }
    }

    // Initiate payment with Khalti
    initKhaltiCheckout(amount, productName, productIdentity, callback) {
        // Check if Khalti is initialized
        if (!this.khaltiInitialized) {
            // Try to initialize again
            if (!this.initializeKhalti()) {
                if (callback && callback.onError) {
                    callback.onError(new Error('Payment system is currently unavailable. Please try again later.'));
                }
                return;
            }
        }

        try {
            const config = {
                publicKey: this.khaltiPublicKey,
                productIdentity: productIdentity,
                productName: productName,
                productUrl: window.location.origin,
                eventHandler: {
                    onSuccess: (payload) => {
                        // Verify payment with Khalti
                        this.verifyKhaltiPayment(payload, callback);
                    },
                    onError: (error) => {
                        console.error('Khalti payment error:', error);
                        if (callback && callback.onError) {
                            callback.onError(error);
                        }
                    },
                    onClose: () => {
                        if (callback && callback.onClose) {
                            callback.onClose();
                        }
                    }
                }
            };

            const checkout = new KhaltiCheckout(config);
            checkout.show({ amount: amount * 100 }); // Khalti expects amount in paisa (1 NPR = 100 paisa)
        } catch (error) {
            console.error('Error initiating Khalti checkout:', error);
            if (callback && callback.onError) {
                callback.onError(new Error('Unable to initiate payment. Please try again later.'));
            }
        }
    }

    // Verify payment with Khalti
    async verifyKhaltiPayment(payload, callback) {
        try {
            // In a real implementation, this would be done server-side
            // For demo purposes, we'll simulate a successful verification
            
            // Mock verification response
            const verificationResponse = {
                success: true,
                token: payload.token,
                amount: payload.amount / 100, // Convert back to NPR
                transaction_id: 'T' + Date.now()
            };

            // Record the payment in Supabase
            await this.recordPayment(verificationResponse, payload);

            if (callback && callback.onSuccess) {
                callback.onSuccess(verificationResponse);
            }
        } catch (error) {
            console.error('Payment verification error:', error);
            if (callback && callback.onError) {
                callback.onError(error);
            }
        }
    }

    // Record payment in Supabase
    async recordPayment(verificationResponse, payload) {
        try {
            // Get current user
            const { data: { user }, error: userError } = await this.supabaseClient.auth.getUser();
            if (userError) throw userError;
            
            if (!user) {
                throw new Error('User not authenticated');
            }

            // In a real implementation, this would save to a payments table
            // For now, we'll just log the payment data
            const paymentData = {
                user_id: user.id,
                amount: verificationResponse.amount,
                transaction_id: verificationResponse.transaction_id,
                payment_method: 'khalti',
                status: 'completed',
                metadata: {
                    khalti_token: verificationResponse.token,
                    khalti_payload: payload
                },
                created_at: new Date().toISOString()
            };

            console.log('Payment recorded:', paymentData);

            // In a real implementation, this would be:
            // const { data, error } = await this.supabaseClient
            //     .from('payments')
            //     .insert([paymentData]);
            
            return paymentData;
        } catch (error) {
            console.error('Error recording payment:', error);
            throw error;
        }
    }

    // Unlock contact for a maid
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

            // Initiate payment for unlocking contact
            const amount = 5; // $5 to unlock contact
            const productName = 'Unlock Maid Contact';
            const productIdentity = `unlock_${user.id}_${maidId}`;

            this.initKhaltiCheckout(amount, productName, productIdentity, {
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
                },
                onClose: () => {
                    if (callback && callback.onClose) {
                        callback.onClose();
                    }
                }
            });
        } catch (error) {
            console.error('Error unlocking contact:', error);
            if (callback && callback.onError) {
                callback.onError(error);
            }
        }
    }

    // Check if contact is already unlocked
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

    // Record unlocked contact in Supabase
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

// Export the PaymentService class
window.PaymentService = PaymentService; 