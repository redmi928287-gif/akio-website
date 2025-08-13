// Supabase Database Service for Akio Comic Website
// Handles all Supabase database operations

class SupabaseService {
    constructor() {
        this.supabase = window.supabase;
    }

    // ===== COMICS OPERATIONS =====
    
    // Add new comic to database
    async addComic(comicData) {
        try {
            const { data, error } = await this.supabase
                .from('comics')
                .insert([{
                    ...comicData,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }])
                .select();
            
            if (error) throw error;
            
            console.log('Comic added successfully:', data[0]);
            return data[0];
        } catch (error) {
            console.error('Error adding comic:', error);
            throw error;
        }
    }

    // Get all comics from database
    async getComics() {
        try {
            const { data, error } = await this.supabase
                .from('comics')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            
            return data || [];
        } catch (error) {
            console.error('Error getting comics:', error);
            throw error;
        }
    }

    // Update comic in database
    async updateComic(comicId, updateData) {
        try {
            const { data, error } = await this.supabase
                .from('comics')
                .update({
                    ...updateData,
                    updated_at: new Date().toISOString()
                })
                .eq('id', comicId)
                .select();
            
            if (error) throw error;
            
            console.log('Comic updated successfully');
            return data[0];
        } catch (error) {
            console.error('Error updating comic:', error);
            throw error;
        }
    }

    // Delete comic from database
    async deleteComic(comicId) {
        try {
            const { error } = await this.supabase
                .from('comics')
                .delete()
                .eq('id', comicId);
            
            if (error) throw error;
            
            console.log('Comic deleted successfully');
        } catch (error) {
            console.error('Error deleting comic:', error);
            throw error;
        }
    }

    // ===== ADS OPERATIONS =====
    
    // Add new ad to database
    async addAd(adData) {
        try {
            const { data, error } = await this.supabase
                .from('ads')
                .insert([{
                    ...adData,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }])
                .select();
            
            if (error) throw error;
            
            console.log('Ad added successfully:', data[0]);
            return data[0];
        } catch (error) {
            console.error('Error adding ad:', error);
            throw error;
        }
    }

    // Get all ads from database
    async getAds() {
        try {
            const { data, error } = await this.supabase
                .from('ads')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            
            return data || [];
        } catch (error) {
            console.error('Error getting ads:', error);
            throw error;
        }
    }

    // Delete ad from database
    async deleteAd(adId) {
        try {
            const { error } = await this.supabase
                .from('ads')
                .delete()
                .eq('id', adId);
            
            if (error) throw error;
            
            console.log('Ad deleted successfully');
        } catch (error) {
            console.error('Error deleting ad:', error);
            throw error;
        }
    }

    // ===== USERS OPERATIONS =====
    
    // Add new user to database
    async addUser(userData) {
        try {
            const { data, error } = await this.supabase
                .from('users')
                .insert([{
                    ...userData,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }])
                .select();
            
            if (error) throw error;
            
            console.log('User added successfully:', data[0]);
            return data[0];
        } catch (error) {
            console.error('Error adding user:', error);
            throw error;
        }
    }

    // Get all users from database
    async getUsers() {
        try {
            const { data, error } = await this.supabase
                .from('users')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            
            return data || [];
        } catch (error) {
            console.error('Error getting users:', error);
            throw error;
        }
    }

    // Update user in database
    async updateUser(userId, updateData) {
        try {
            const { data, error } = await this.supabase
                .from('users')
                .update({
                    ...updateData,
                    updated_at: new Date().toISOString()
                })
                .eq('id', userId)
                .select();
            
            if (error) throw error;
            
            console.log('User updated successfully');
            return data[0];
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    }

    // ===== IMAGE UPLOAD OPERATIONS =====
    
    // Upload image to Supabase Storage
    async uploadImage(file, path) {
        try {
            const { data, error } = await this.supabase.storage
                .from('images')
                .upload(path, file);
            
            if (error) throw error;
            
            // Get public URL
            const { data: { publicUrl } } = this.supabase.storage
                .from('images')
                .getPublicUrl(path);
            
            console.log('Image uploaded successfully:', publicUrl);
            return publicUrl;
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    }

    // Delete image from Supabase Storage
    async deleteImage(path) {
        try {
            const { error } = await this.supabase.storage
                .from('images')
                .remove([path]);
            
            if (error) throw error;
            
            console.log('Image deleted successfully');
        } catch (error) {
            console.error('Error deleting image:', error);
            throw error;
        }
    }

    // ===== STATISTICS OPERATIONS =====
    
    // Update website statistics
    async updateStats(statsData) {
        try {
            const { data, error } = await this.supabase
                .from('statistics')
                .upsert([{
                    id: 'website-stats',
                    ...statsData,
                    updated_at: new Date().toISOString()
                }], { onConflict: 'id' })
                .select();
            
            if (error) throw error;
            
            console.log('Stats updated successfully');
            return data[0];
        } catch (error) {
            console.error('Error updating stats:', error);
            throw error;
        }
    }

    // Get website statistics
    async getStats() {
        try {
            const { data, error } = await this.supabase
                .from('statistics')
                .select('*')
                .eq('id', 'website-stats')
                .single();
            
            if (error) throw error;
            
            return data;
        } catch (error) {
            console.error('Error getting stats:', error);
            return null;
        }
    }

    // ===== REAL-TIME LISTENERS =====
    
    // Listen for real-time comic updates
    onComicsUpdate(callback) {
        return this.supabase
            .channel('comics-changes')
            .on('postgres_changes', 
                { event: '*', schema: 'public', table: 'comics' },
                (payload) => {
                    console.log('Comics real-time update:', payload);
                    // Refresh comics data
                    this.getComics().then(callback);
                }
            )
            .subscribe();
    }

    // Listen for real-time ad updates
    onAdsUpdate(callback) {
        return this.supabase
            .channel('ads-changes')
            .on('postgres_changes', 
                { event: '*', schema: 'public', table: 'ads' },
                (payload) => {
                    console.log('Ads real-time update:', payload);
                    // Refresh ads data
                    this.getAds().then(callback);
                }
            )
            .subscribe();
    }

    // Listen for real-time user updates
    onUsersUpdate(callback) {
        return this.supabase
            .channel('users-changes')
            .on('postgres_changes', 
                { event: '*', schema: 'public', table: 'users' },
                (payload) => {
                    console.log('Users real-time update:', payload);
                    // Refresh users data
                    this.getUsers().then(callback);
                }
            )
            .subscribe();
    }

    // ===== UTILITY FUNCTIONS =====
    
    // Initialize database with sample data
    async initializeDatabase() {
        try {
            // Check if comics table has data
            const comics = await this.getComics();
            if (comics.length === 0) {
                console.log('Initializing database with sample data...');
                
                // Add sample comics
                const sampleComics = [
                    {
                        title: "The Adventure Begins",
                        description: "An epic journey through magical realms with stunning artwork and compelling storytelling.",
                        link: "https://t.me/beast_is_kum",
                        thumbnail: "https://via.placeholder.com/300x200/667eea/ffffff?text=Comic+1",
                        views: Math.floor(Math.random() * 4000) + 5000,
                        likes: Math.floor(Math.random() * 2000) + 2000
                    },
                    {
                        title: "Mystery of the Dark Forest",
                        description: "A thrilling mystery comic that will keep you on the edge of your seat until the very end.",
                        link: "https://t.me/beast_is_kum",
                        thumbnail: "https://via.placeholder.com/300x200/764ba2/ffffff?text=Comic+2",
                        views: Math.floor(Math.random() * 4000) + 5000,
                        likes: Math.floor(Math.random() * 2000) + 2000
                    }
                ];
                
                for (const comic of sampleComics) {
                    await this.addComic(comic);
                }
                
                console.log('Sample comics added successfully');
            }
            
            // Check if users table has data
            const users = await this.getUsers();
            if (users.length === 0) {
                console.log('Initializing users table...');
                
                // Add sample users
                const sampleUsers = [
                    {
                        username: "ComicLover123",
                        join_date: "Jan 15, 2024",
                        status: "active",
                        type: "premium"
                    },
                    {
                        username: "MangaFan456",
                        join_date: "Jan 14, 2024",
                        status: "active",
                        type: "normal"
                    }
                ];
                
                for (const user of sampleUsers) {
                    await this.addUser(user);
                }
                
                console.log('Sample users added successfully');
            }
            
            console.log('Database initialization completed');
        } catch (error) {
            console.error('Error initializing database:', error);
        }
    }
}

// Create global instance
window.supabaseService = new SupabaseService(); 