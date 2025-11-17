        // Menu hamburger
        const hamburger = document.getElementById('hamburger');
        const mobileMenu = document.getElementById('mobileMenu');
        const closeMenu = document.getElementById('closeMenu');
        const overlay = document.getElementById('overlay');
        
        function openMenu() {
            mobileMenu.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
        
        function closeMobileMenu() {
            mobileMenu.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
        
        hamburger.addEventListener('click', openMenu);
        closeMenu.addEventListener('click', closeMobileMenu);
        overlay.addEventListener('click', closeMobileMenu);
        
        // Fermer le menu en cliquant sur un lien
        const mobileLinks = document.querySelectorAll('.mobile-nav a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
        
        // Activation des éléments de la barre mobile
        const bottomItems = document.querySelectorAll('.mobile-bottom-item');
        bottomItems.forEach(item => {
            item.addEventListener('click', function() {
                bottomItems.forEach(i => i.classList.remove('active'));
                this.classList.add('active');
            });
        });


        // panier

        // Panier JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Éléments du DOM
    const cartIcon = document.getElementById('cart-icon');
    const mobileCartIcon = document.getElementById('mobile-cart-icon');
    const cartSidebar = document.getElementById('cart-sidebar');
    const closeCartBtn = document.getElementById('close-cart');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartContent = document.getElementById('cart-content');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    // Initialisation du panier
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Mettre à jour l'affichage du panier
    function updateCartDisplay() {
        // Vider le contenu du panier
        cartContent.innerHTML = '';
        
        if (cart.length === 0) {
            // Panier vide
            cartContent.innerHTML = `
                <div class="cart-empty">
                    <i class="fas fa-shopping-bag" style="font-size: 48px; margin-bottom: 15px;"></i>
                    <p>Votre panier est vide</p>
                </div>
            `;
            cartCount.textContent = '0';
            cartTotal.textContent = '0,00 د.ج';
        } else {
            // Panier avec des articles
            let total = 0;
            let itemCount = 0;
            
            cart.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">${item.price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} د.ج</div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn decrease-qty" data-id="${item.id}">-</button>
                            <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
                            <button class="quantity-btn increase-qty" data-id="${item.id}">+</button>
                            <button class="cart-item-remove remove-item" data-id="${item.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
                cartContent.appendChild(cartItem);
                
                total += item.price * item.quantity;
                itemCount += item.quantity;
            });
            
            cartCount.textContent = itemCount;
            cartTotal.textContent = total.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' د.ج';
            
            // Ajouter les écouteurs d'événements pour les nouveaux éléments
            document.querySelectorAll('.decrease-qty').forEach(btn => {
                btn.addEventListener('click', decreaseQuantity);
            });
            
            document.querySelectorAll('.increase-qty').forEach(btn => {
                btn.addEventListener('click', increaseQuantity);
            });
            
            document.querySelectorAll('.quantity-input').forEach(input => {
                input.addEventListener('change', updateQuantity);
            });
            
            document.querySelectorAll('.remove-item').forEach(btn => {
                btn.addEventListener('click', removeFromCart);
            });
        }
        
        // Sauvegarder le panier dans le localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    
    // Ouvrir le panier
    function openCart() {
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // Fermer le panier
    function closeCart() {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Ajouter un produit au panier
    function addToCart(e) {
        const button = e.currentTarget;
        const productId = button.getAttribute('data-product-id');
        const productName = button.getAttribute('data-product-name');
        const productPrice = parseFloat(button.getAttribute('data-product-price'));
        const productImage = button.getAttribute('data-product-image');
        
        // Vérifier si le produit est déjà dans le panier
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            // Si le produit est déjà dans le panier, augmenter la quantité
            existingItem.quantity++;
        } else {
            // Sinon, ajouter le produit au panier
            cart.push({
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: 1
            });
        }
        
        // Mettre à jour l'affichage du panier
        updateCartDisplay();
        
        // Ouvrir le panier
        openCart();
    }
    
    // Augmenter la quantité d'un produit
    function increaseQuantity(e) {
        const productId = e.currentTarget.getAttribute('data-id');
        const item = cart.find(item => item.id === productId);
        
        if (item) {
            item.quantity++;
            updateCartDisplay();
        }
    }
    
    // Diminuer la quantité d'un produit
    function decreaseQuantity(e) {
        const productId = e.currentTarget.getAttribute('data-id');
        const item = cart.find(item => item.id === productId);
        
        if (item && item.quantity > 1) {
            item.quantity--;
            updateCartDisplay();
        }
    }
    
    // Mettre à jour la quantité d'un produit
    function updateQuantity(e) {
        const productId = e.currentTarget.getAttribute('data-id');
        const newQuantity = parseInt(e.currentTarget.value);
        const item = cart.find(item => item.id === productId);
        
        if (item && newQuantity > 0) {
            item.quantity = newQuantity;
            updateCartDisplay();
        }
    }
    
    // Supprimer un produit du panier
    function removeFromCart(e) {
        const productId = e.currentTarget.getAttribute('data-id');
        cart = cart.filter(item => item.id !== productId);
        updateCartDisplay();
    }
    
    // Écouteurs d'événements
    cartIcon.addEventListener('click', openCart);
    mobileCartIcon.addEventListener('click', openCart);
    closeCartBtn.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', addToCart);
    });
    
    // Initialiser l'affichage du panier au chargement de la page
    updateCartDisplay();
});


    // Wishlist JavaScript
    document.addEventListener('DOMContentLoaded', function() {
        // Éléments du DOM pour la wishlist
        const wishlistIcon = document.getElementById('wishlist-icon');
        const mobileWishlistIcon = document.getElementById('mobile-wishlist-icon');
        const mobileBottomWishlist = document.getElementById('mobile-bottom-wishlist');
        const wishlistSidebar = document.getElementById('wishlist-sidebar');
        const closeWishlistBtn = document.getElementById('close-wishlist');
        const wishlistOverlay = document.getElementById('wishlist-overlay');
        const wishlistContent = document.getElementById('wishlist-content');
        const wishlistCount = document.getElementById('wishlist-count');
        const wishlistButtons = document.querySelectorAll('.wishlist-icon');
        
        // Initialisation de la wishlist
        let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        
        // Mettre à jour l'affichage de la wishlist
        function updateWishlistDisplay() {
            // Vider le contenu de la wishlist
            wishlistContent.innerHTML = '';
            
            if (wishlist.length === 0) {
                // Wishlist vide
                wishlistContent.innerHTML = `
                    <div class="wishlist-empty">
                        <i class="far fa-heart" style="font-size: 48px; margin-bottom: 15px;"></i>
                        <p>Votre wishlist est vide</p>
                    </div>
                `;
                wishlistCount.textContent = '0';
            } else {
                // Wishlist avec des articles
                wishlist.forEach(item => {
                    const wishlistItem = document.createElement('div');
                    wishlistItem.className = 'wishlist-item';
                    wishlistItem.innerHTML = `
                        <img src="${item.image}" alt="${item.name}" class="wishlist-item-image">
                        <div class="wishlist-item-details">
                            <div class="wishlist-item-name">${item.name}</div>
                            <div class="wishlist-item-price">${item.price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} د.ج</div>
                            <div class="wishlist-item-actions">
                                <button class="wishlist-add-to-cart add-to-cart-from-wishlist" data-id="${item.id}" data-name="${item.name}" data-price="${item.price}" data-image="${item.image}">
                                    AJOUTER AU PANIER
                                </button>
                                <button class="wishlist-item-remove remove-from-wishlist" data-id="${item.id}">
                                    <i class="fas fa-trash"></i> Supprimer
                                </button>
                            </div>
                        </div>
                    `;
                    wishlistContent.appendChild(wishlistItem);
                });
                
                wishlistCount.textContent = wishlist.length;
                
                // Ajouter les écouteurs d'événements pour les nouveaux éléments
                document.querySelectorAll('.remove-from-wishlist').forEach(btn => {
                    btn.addEventListener('click', removeFromWishlist);
                });
                
                document.querySelectorAll('.add-to-cart-from-wishlist').forEach(btn => {
                    btn.addEventListener('click', addToCartFromWishlist);
                });
            }
            
            // Sauvegarder la wishlist dans le localStorage
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
        }
        
        // Ouvrir la wishlist
        function openWishlist() {
            wishlistSidebar.classList.add('active');
            wishlistOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
        
        // Fermer la wishlist
        function closeWishlist() {
            wishlistSidebar.classList.remove('active');
            wishlistOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        // Ajouter un produit à la wishlist
        function addToWishlist(e) {
            const button = e.currentTarget;
            const productCard = button.closest('.product-card');
            const productId = productCard.getAttribute('data-product-id');
            const productName = productCard.querySelector('.name').textContent;
            const productPriceText = productCard.querySelector('.price').textContent;
            const productPrice = parseFloat(productPriceText.replace(/[^\d,]/g, '').replace(',', '.'));
            const productImage = productCard.querySelector('img').src;
            
            // Vérifier si le produit est déjà dans la wishlist
            const existingItem = wishlist.find(item => item.id === productId);
            
            if (!existingItem) {
                // Ajouter le produit à la wishlist
                wishlist.push({
                    id: productId,
                    name: productName,
                    price: productPrice,
                    image: productImage
                });
                
                // Mettre à jour l'affichage de la wishlist
                updateWishlistDisplay();
                updateWishlistIcons();
            } else {
                // Si déjà dans la wishlist, le retirer
                wishlist = wishlist.filter(item => item.id !== productId);
                updateWishlistDisplay();
                updateWishlistIcons();
            }
        }
        
        // Supprimer un produit de la wishlist
        function removeFromWishlist(e) {
            const productId = e.currentTarget.getAttribute('data-id');
            wishlist = wishlist.filter(item => item.id !== productId);
            updateWishlistDisplay();
            updateWishlistIcons();
        }
        
        // Ajouter au panier depuis la wishlist
        function addToCartFromWishlist(e) {
            const productId = e.currentTarget.getAttribute('data-id');
            const productName = e.currentTarget.getAttribute('data-name');
            const productPrice = parseFloat(e.currentTarget.getAttribute('data-price'));
            const productImage = e.currentTarget.getAttribute('data-image');
            
            // Ajouter au panier
            addToCartFunction(productId, productName, productPrice, productImage);
            
            // Fermer la wishlist
            closeWishlist();
        }
        
        // Mettre à jour les icônes de wishlist dans les produits
        function updateWishlistIcons() {
            const productCards = document.querySelectorAll('.product-card');
            productCards.forEach(card => {
                const productId = card.getAttribute('data-product-id');
                const wishlistBtn = card.querySelector('.wishlist-icon');
                const isInWishlist = wishlist.find(item => item.id === productId);
                
                if (isInWishlist) {
                    wishlistBtn.innerHTML = '<i class="fa-solid fa-heart"></i>';
                    wishlistBtn.style.color = '#ff0000';
                } else {
                    wishlistBtn.innerHTML = '<i class="fa-regular fa-heart"></i>';
                    wishlistBtn.style.color = '';
                }
            });
        }
        
        // Écouteurs d'événements pour la wishlist
        wishlistIcon.addEventListener('click', openWishlist);
        mobileWishlistIcon.addEventListener('click', openWishlist);
        mobileBottomWishlist.addEventListener('click', openWishlist);
        closeWishlistBtn.addEventListener('click', closeWishlist);
        wishlistOverlay.addEventListener('click', closeWishlist);
        
        wishlistButtons.forEach(button => {
            button.addEventListener('click', addToWishlist);
        });
        
        // Initialiser l'affichage de la wishlist au chargement de la page
        updateWishlistDisplay();
        updateWishlistIcons();
    });

    // Panier JavaScript
    document.addEventListener('DOMContentLoaded', function() {
        // Éléments du DOM
        const cartIcon = document.getElementById('cart-icon');
        const mobileCartIcon = document.getElementById('mobile-cart-icon');
        const cartSidebar = document.getElementById('cart-sidebar');
        const closeCartBtn = document.getElementById('close-cart');
        const cartOverlay = document.getElementById('cart-overlay');
        const cartContent = document.getElementById('cart-content');
        const cartCount = document.getElementById('cart-count');
        const cartTotal = document.getElementById('cart-total');
        const addToCartButtons = document.querySelectorAll('.add-to-cart');
        
        // Initialisation du panier
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Mettre à jour l'affichage du panier
        function updateCartDisplay() {
            // Vider le contenu du panier
            cartContent.innerHTML = '';
            
            if (cart.length === 0) {
                // Panier vide
                cartContent.innerHTML = `
                    <div class="cart-empty">
                        <i class="fas fa-shopping-bag" style="font-size: 48px; margin-bottom: 15px;"></i>
                        <p>Votre panier est vide</p>
                    </div>
                `;
                cartCount.textContent = '0';
                cartTotal.textContent = '0,00 د.ج';
            } else {
                // Panier avec des articles
                let total = 0;
                let itemCount = 0;
                
                cart.forEach(item => {
                    const cartItem = document.createElement('div');
                    cartItem.className = 'cart-item';
                    cartItem.innerHTML = `
                        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                        <div class="cart-item-details">
                            <div class="cart-item-name">${item.name}</div>
                            <div class="cart-item-price">${item.price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} د.ج</div>
                            <div class="cart-item-quantity">
                                <button class="quantity-btn decrease-qty" data-id="${item.id}">-</button>
                                <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
                                <button class="quantity-btn increase-qty" data-id="${item.id}">+</button>
                                <button class="cart-item-remove remove-item" data-id="${item.id}">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    `;
                    cartContent.appendChild(cartItem);
                    
                    total += item.price * item.quantity;
                    itemCount += item.quantity;
                });
                
                cartCount.textContent = itemCount;
                cartTotal.textContent = total.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' د.ج';
                
                // Ajouter les écouteurs d'événements pour les nouveaux éléments
                document.querySelectorAll('.decrease-qty').forEach(btn => {
                    btn.addEventListener('click', decreaseQuantity);
                });
                
                document.querySelectorAll('.increase-qty').forEach(btn => {
                    btn.addEventListener('click', increaseQuantity);
                });
                
                document.querySelectorAll('.quantity-input').forEach(input => {
                    input.addEventListener('change', updateQuantity);
                });
                
                document.querySelectorAll('.remove-item').forEach(btn => {
                    btn.addEventListener('click', removeFromCart);
                });
            }
            
            // Sauvegarder le panier dans le localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
        }
        
        // Ouvrir le panier
        function openCart() {
            cartSidebar.classList.add('active');
            cartOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
        
        // Fermer le panier
        function closeCart() {
            cartSidebar.classList.remove('active');
            cartOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        // Fonction pour ajouter au panier (utilisée par la wishlist)
        function addToCartFunction(productId, productName, productPrice, productImage) {
            // Vérifier si le produit est déjà dans le panier
            const existingItem = cart.find(item => item.id === productId);
            
            if (existingItem) {
                // Si le produit est déjà dans le panier, augmenter la quantité
                existingItem.quantity++;
            } else {
                // Sinon, ajouter le produit au panier
                cart.push({
                    id: productId,
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    quantity: 1
                });
            }
            
            // Mettre à jour l'affichage du panier
            updateCartDisplay();
            
            // Ouvrir le panier
            openCart();
        }
        
        // Ajouter un produit au panier
        function addToCart(e) {
            const button = e.currentTarget;
            const productId = button.getAttribute('data-product-id');
            const productName = button.getAttribute('data-product-name');
            const productPrice = parseFloat(button.getAttribute('data-product-price'));
            const productImage = button.getAttribute('data-product-image');
            
            addToCartFunction(productId, productName, productPrice, productImage);
        }
        
        // Augmenter la quantité d'un produit
        function increaseQuantity(e) {
            const productId = e.currentTarget.getAttribute('data-id');
            const item = cart.find(item => item.id === productId);
            
            if (item) {
                item.quantity++;
                updateCartDisplay();
            }
        }
        
        // Diminuer la quantité d'un produit
        function decreaseQuantity(e) {
            const productId = e.currentTarget.getAttribute('data-id');
            const item = cart.find(item => item.id === productId);
            
            if (item && item.quantity > 1) {
                item.quantity--;
                updateCartDisplay();
            }
        }
        
        // Mettre à jour la quantité d'un produit
        function updateQuantity(e) {
            const productId = e.currentTarget.getAttribute('data-id');
            const newQuantity = parseInt(e.currentTarget.value);
            const item = cart.find(item => item.id === productId);
            
            if (item && newQuantity > 0) {
                item.quantity = newQuantity;
                updateCartDisplay();
            }
        }
        
        // Supprimer un produit du panier
        function removeFromCart(e) {
            const productId = e.currentTarget.getAttribute('data-id');
            cart = cart.filter(item => item.id !== productId);
            updateCartDisplay();
        }
        
        // Écouteurs d'événements
        cartIcon.addEventListener('click', openCart);
        mobileCartIcon.addEventListener('click', openCart);
        closeCartBtn.addEventListener('click', closeCart);
        cartOverlay.addEventListener('click', closeCart);
        
        addToCartButtons.forEach(button => {
            button.addEventListener('click', addToCart);
        });
        
        // Initialiser l'affichage du panier au chargement de la page
        updateCartDisplay();
    });

        // Wishlist JavaScript
    document.addEventListener('DOMContentLoaded', function() {
        // Éléments du DOM pour la wishlist
        const wishlistIcon = document.getElementById('wishlist-icon');
        const mobileWishlistIcon = document.getElementById('mobile-wishlist-icon');
        const mobileBottomWishlist = document.getElementById('mobile-bottom-wishlist');
        const wishlistSidebar = document.getElementById('wishlist-sidebar');
        const closeWishlistBtn = document.getElementById('close-wishlist');
        const wishlistOverlay = document.getElementById('wishlist-overlay');
        const wishlistContent = document.getElementById('wishlist-content');
        const wishlistCount = document.getElementById('wishlist-count');
        const mobileWishlistCount = document.getElementById('mobile-wishlist-count');
        const wishlistButtons = document.querySelectorAll('.wishlist-icon');
        
        // Initialisation de la wishlist
        let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        
        // Mettre à jour l'affichage de la wishlist
        function updateWishlistDisplay() {
            // Vider le contenu de la wishlist
            wishlistContent.innerHTML = '';
            
            if (wishlist.length === 0) {
                // Wishlist vide
                wishlistContent.innerHTML = `
                    <div class="wishlist-empty">
                        <i class="far fa-heart" style="font-size: 48px; margin-bottom: 15px;"></i>
                        <p>Votre wishlist est vide</p>
                    </div>
                `;
                wishlistCount.textContent = '0';
                mobileWishlistCount.textContent = '0';
            } else {
                // Wishlist avec des articles
                wishlist.forEach(item => {
                    const wishlistItem = document.createElement('div');
                    wishlistItem.className = 'wishlist-item';
                    wishlistItem.innerHTML = `
                        <img src="${item.image}" alt="${item.name}" class="wishlist-item-image">
                        <div class="wishlist-item-details">
                            <div class="wishlist-item-name">${item.name}</div>
                            <div class="wishlist-item-price">${item.price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} د.ج</div>
                            <div class="wishlist-item-actions">
                                <button class="wishlist-add-to-cart add-to-cart-from-wishlist" data-id="${item.id}" data-name="${item.name}" data-price="${item.price}" data-image="${item.image}">
                                    AJOUTER AU PANIER
                                </button>
                                <button class="wishlist-item-remove remove-from-wishlist" data-id="${item.id}">
                                    <i class="fas fa-trash"></i> Supprimer
                                </button>
                            </div>
                        </div>
                    `;
                    wishlistContent.appendChild(wishlistItem);
                });
                
                wishlistCount.textContent = wishlist.length;
                mobileWishlistCount.textContent = wishlist.length;
                
                // Ajouter les écouteurs d'événements pour les nouveaux éléments
                document.querySelectorAll('.remove-from-wishlist').forEach(btn => {
                    btn.addEventListener('click', removeFromWishlist);
                });
                
                document.querySelectorAll('.add-to-cart-from-wishlist').forEach(btn => {
                    btn.addEventListener('click', addToCartFromWishlist);
                });
            }
            
            // Sauvegarder la wishlist dans le localStorage
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
        }
        
        // Ouvrir la wishlist
        function openWishlist() {
            wishlistSidebar.classList.add('active');
            wishlistOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
        
        // Fermer la wishlist
        function closeWishlist() {
            wishlistSidebar.classList.remove('active');
            wishlistOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        // Ajouter un produit à la wishlist
        function addToWishlist(e) {
            const button = e.currentTarget;
            const productCard = button.closest('.product-card');
            const productId = productCard.getAttribute('data-product-id');
            const productName = productCard.querySelector('.name').textContent;
            const productPriceText = productCard.querySelector('.price').textContent;
            const productPrice = parseFloat(productPriceText.replace(/[^\d,]/g, '').replace(',', '.'));
            const productImage = productCard.querySelector('img').src;
            
            // Vérifier si le produit est déjà dans la wishlist
            const existingItem = wishlist.find(item => item.id === productId);
            
            if (!existingItem) {
                // Ajouter le produit à la wishlist
                wishlist.push({
                    id: productId,
                    name: productName,
                    price: productPrice,
                    image: productImage
                });
                
                // Mettre à jour l'affichage de la wishlist
                updateWishlistDisplay();
                updateWishlistIcons();
            } else {
                // Si déjà dans la wishlist, le retirer
                wishlist = wishlist.filter(item => item.id !== productId);
                updateWishlistDisplay();
                updateWishlistIcons();
            }
        }
        
        // Supprimer un produit de la wishlist
        function removeFromWishlist(e) {
            const productId = e.currentTarget.getAttribute('data-id');
            wishlist = wishlist.filter(item => item.id !== productId);
            updateWishlistDisplay();
            updateWishlistIcons();
        }
        
        // Ajouter au panier depuis la wishlist
        function addToCartFromWishlist(e) {
            const productId = e.currentTarget.getAttribute('data-id');
            const productName = e.currentTarget.getAttribute('data-name');
            const productPrice = parseFloat(e.currentTarget.getAttribute('data-price'));
            const productImage = e.currentTarget.getAttribute('data-image');
            
            // Ajouter au panier
            addToCartFunction(productId, productName, productPrice, productImage);
            
            // Fermer la wishlist
            closeWishlist();
        }
        
        // Mettre à jour les icônes de wishlist dans les produits
        function updateWishlistIcons() {
            const productCards = document.querySelectorAll('.product-card');
            productCards.forEach(card => {
                const productId = card.getAttribute('data-product-id');
                const wishlistBtn = card.querySelector('.wishlist-icon');
                const isInWishlist = wishlist.find(item => item.id === productId);
                
                if (isInWishlist) {
                    wishlistBtn.innerHTML = '<i class="fa-solid fa-heart"></i>';
                    wishlistBtn.style.color = '#ff0000';
                } else {
                    wishlistBtn.innerHTML = '<i class="fa-regular fa-heart"></i>';
                    wishlistBtn.style.color = '';
                }
            });
        }
        
        // Écouteurs d'événements pour la wishlist
        wishlistIcon.addEventListener('click', openWishlist);
        mobileWishlistIcon.addEventListener('click', openWishlist);
        mobileBottomWishlist.addEventListener('click', openWishlist);
        closeWishlistBtn.addEventListener('click', closeWishlist);
        wishlistOverlay.addEventListener('click', closeWishlist);
        
        wishlistButtons.forEach(button => {
            button.addEventListener('click', addToWishlist);
        });
        
        // Initialiser l'affichage de la wishlist au chargement de la page
        updateWishlistDisplay();
        updateWishlistIcons();
    });

    // Panier JavaScript
    document.addEventListener('DOMContentLoaded', function() {
        // Éléments du DOM
        const cartIcon = document.getElementById('cart-icon');
        const mobileCartIcon = document.getElementById('mobile-cart-icon');
        const cartSidebar = document.getElementById('cart-sidebar');
        const closeCartBtn = document.getElementById('close-cart');
        const cartOverlay = document.getElementById('cart-overlay');
        const cartContent = document.getElementById('cart-content');
        const cartCount = document.getElementById('cart-count');
        const mobileCartCount = document.getElementById('mobile-cart-count');
        const cartTotal = document.getElementById('cart-total');
        const addToCartButtons = document.querySelectorAll('.add-to-cart');
        
        // Initialisation du panier
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Mettre à jour l'affichage du panier
        function updateCartDisplay() {
            // Vider le contenu du panier
            cartContent.innerHTML = '';
            
            if (cart.length === 0) {
                // Panier vide
                cartContent.innerHTML = `
                    <div class="cart-empty">
                        <i class="fas fa-shopping-bag" style="font-size: 48px; margin-bottom: 15px;"></i>
                        <p>Votre panier est vide</p>
                    </div>
                `;
                cartCount.textContent = '0';
                mobileCartCount.textContent = '0';
                cartTotal.textContent = '0,00 د.ج';
            } else {
                // Panier avec des articles
                let total = 0;
                let itemCount = 0;
                
                cart.forEach(item => {
                    const cartItem = document.createElement('div');
                    cartItem.className = 'cart-item';
                    cartItem.innerHTML = `
                        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                        <div class="cart-item-details">
                            <div class="cart-item-name">${item.name}</div>
                            <div class="cart-item-price">${item.price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} د.ج</div>
                            <div class="cart-item-quantity">
                                <button class="quantity-btn decrease-qty" data-id="${item.id}">-</button>
                                <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
                                <button class="quantity-btn increase-qty" data-id="${item.id}">+</button>
                                <button class="cart-item-remove remove-item" data-id="${item.id}">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    `;
                    cartContent.appendChild(cartItem);
                    
                    total += item.price * item.quantity;
                    itemCount += item.quantity;
                });
                
                cartCount.textContent = itemCount;
                mobileCartCount.textContent = itemCount;
                cartTotal.textContent = total.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' د.ج';
                
                // Ajouter les écouteurs d'événements pour les nouveaux éléments
                document.querySelectorAll('.decrease-qty').forEach(btn => {
                    btn.addEventListener('click', decreaseQuantity);
                });
                
                document.querySelectorAll('.increase-qty').forEach(btn => {
                    btn.addEventListener('click', increaseQuantity);
                });
                
                document.querySelectorAll('.quantity-input').forEach(input => {
                    input.addEventListener('change', updateQuantity);
                });
                
                document.querySelectorAll('.remove-item').forEach(btn => {
                    btn.addEventListener('click', removeFromCart);
                });
            }
            
            // Sauvegarder le panier dans le localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
        }
        
        // Ouvrir le panier
        function openCart() {
            cartSidebar.classList.add('active');
            cartOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
        
        // Fermer le panier
        function closeCart() {
            cartSidebar.classList.remove('active');
            cartOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        // Fonction pour ajouter au panier (utilisée par la wishlist)
        function addToCartFunction(productId, productName, productPrice, productImage) {
            // Vérifier si le produit est déjà dans le panier
            const existingItem = cart.find(item => item.id === productId);
            
            if (existingItem) {
                // Si le produit est déjà dans le panier, augmenter la quantité
                existingItem.quantity++;
            } else {
                // Sinon, ajouter le produit au panier
                cart.push({
                    id: productId,
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    quantity: 1
                });
            }
            
            // Mettre à jour l'affichage du panier
            updateCartDisplay();
            
            // Ouvrir le panier
            openCart();
        }
        
        // Ajouter un produit au panier
        function addToCart(e) {
            const button = e.currentTarget;
            const productId = button.getAttribute('data-product-id');
            const productName = button.getAttribute('data-product-name');
            const productPrice = parseFloat(button.getAttribute('data-product-price'));
            const productImage = button.getAttribute('data-product-image');
            
            addToCartFunction(productId, productName, productPrice, productImage);
        }
        
        // Augmenter la quantité d'un produit
        function increaseQuantity(e) {
            const productId = e.currentTarget.getAttribute('data-id');
            const item = cart.find(item => item.id === productId);
            
            if (item) {
                item.quantity++;
                updateCartDisplay();
            }
        }
        
        // Diminuer la quantité d'un produit
        function decreaseQuantity(e) {
            const productId = e.currentTarget.getAttribute('data-id');
            const item = cart.find(item => item.id === productId);
            
            if (item && item.quantity > 1) {
                item.quantity--;
                updateCartDisplay();
            }
        }
        
        // Mettre à jour la quantité d'un produit
        function updateQuantity(e) {
            const productId = e.currentTarget.getAttribute('data-id');
            const newQuantity = parseInt(e.currentTarget.value);
            const item = cart.find(item => item.id === productId);
            
            if (item && newQuantity > 0) {
                item.quantity = newQuantity;
                updateCartDisplay();
            }
        }
        
        // Supprimer un produit du panier
        function removeFromCart(e) {
            const productId = e.currentTarget.getAttribute('data-id');
            cart = cart.filter(item => item.id !== productId);
            updateCartDisplay();
        }
        
        // Écouteurs d'événements
        cartIcon.addEventListener('click', openCart);
        mobileCartIcon.addEventListener('click', openCart);
        closeCartBtn.addEventListener('click', closeCart);
        cartOverlay.addEventListener('click', closeCart);
        
        addToCartButtons.forEach(button => {
            button.addEventListener('click', addToCart);
        });
        
        // Initialiser l'affichage du panier au chargement de la page
        updateCartDisplay();
    });


            // === CONFIGURATION FIREBASE ===
        const firebaseConfig = {
            apiKey: "AIzaSyBB8zPrG4MjAqBm1SOxIFQdWtiCmz_v92s",
            authDomain: "luxur-6b128.firebaseapp.com",
            projectId: "luxur-6b128",
            storageBucket: "luxur-6b128.firebasestorage.app",
            messagingSenderId: "900453735371",
            appId: "1:900453735371:web:e32188ac6ea261084c344e"
        };

        // Initialiser Firebase
        firebase.initializeApp(firebaseConfig);
        const db = firebase.firestore();
        const storage = firebase.storage();
        const productsRef = db.collection('products');

        // Éléments du DOM
        const productsGrid = document.getElementById('products-grid');
        const quickViewModal = document.getElementById('quick-view-modal');
        const currentCountSpan = document.getElementById('current-count');
        const totalCountSpan = document.getElementById('total-count');
        const activeFiltersContainer = document.getElementById('activeFilters');

        // Variables globales pour le panier et la wishlist
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        
        // Variables pour les filtres
        let allProducts = [];
        let filteredProducts = [];
        let currentFilters = {
            priceMin: 0,
            priceMax: 100000,
            brands: [],
            genders: []
        };
        
        // AJOUT: Variable pour stocker l'ID du produit actuel dans la vue rapide
        let currentProductId = null;

        // === FONCTIONS POUR LA GESTION DES PRODUITS ===
        
        // Fonction pour afficher une notification
        function showNotification(message, type = 'success') {
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.textContent = message;
            document.body.appendChild(notification);
            setTimeout(() => notification.classList.add('show'), 100);
            setTimeout(() => { 
                notification.classList.remove('show'); 
                setTimeout(() => document.body.removeChild(notification), 300); 
            }, 3000);
        }

        // Fonction pour charger les produits depuis Firebase
        async function loadProductsFromFirebase() {
            productsGrid.innerHTML = '<div class="spinner"></div>';
            
            try {
                const snapshot = await productsRef.orderBy('createdAt', 'desc').get();
                allProducts = [];
                
                if (snapshot.empty) {
                    productsGrid.innerHTML = '<p style="text-align: center; width: 100%; grid-column: 1/-1;">Aucun produit trouvé pour le moment.</p>';
                    currentCountSpan.textContent = '0';
                    totalCountSpan.textContent = '0';
                } else {
                    snapshot.forEach(doc => {
                        const product = {
                            id: doc.id,
                            ...doc.data()
                        };
                        allProducts.push(product);
                    });
                    
                    // Extraire les marques et catégories uniques
                    populateFilters();
                    
                    // Appliquer les filtres actuels
                    applyFilters();
                }
            } catch (error) {
                console.error("Erreur de chargement des produits:", error);
                productsGrid.innerHTML = '<p style="text-align: center; width: 100%; grid-column: 1/-1;">Erreur lors du chargement des produits.</p>';
                showNotification('Erreur lors du chargement des produits', 'error');
            }
        }

        // Fonction pour extraire les marques et catégories uniques et générer les filtres
        function populateFilters() {
            // Extraire les marques uniques
            const brands = [...new Set(allProducts.map(product => product.brand))].filter(Boolean);
            
            // Extraire les catégories uniques
            const categories = [...new Set(allProducts.map(product => product.category))].filter(Boolean);
            
            // Générer les filtres de marque pour desktop
            const desktopBrandFilters = document.getElementById('desktop-brand-filters');
            desktopBrandFilters.innerHTML = '';
            
            brands.forEach(brand => {
                const brandValue = brand.toLowerCase().replace(/\s+/g, '-');
                const checkbox = document.createElement('label');
                checkbox.className = 'filter-checkbox';
                checkbox.innerHTML = `
                    <input type="checkbox" name="brand" value="${brandValue}">
                    <span>${brand}</span>
                `;
                desktopBrandFilters.appendChild(checkbox);
            });
            
            // Générer les filtres de marque pour mobile
            const mobileBrandFilters = document.getElementById('mobile-brand-filters');
            mobileBrandFilters.innerHTML = '';
            
            brands.forEach(brand => {
                const brandValue = brand.toLowerCase().replace(/\s+/g, '-');
                const checkbox = document.createElement('label');
                checkbox.className = 'filter-checkbox';
                checkbox.innerHTML = `
                    <input type="checkbox" name="brand" value="${brandValue}">
                    <span>${brand}</span>
                `;
                mobileBrandFilters.appendChild(checkbox);
            });
            
            // Générer les filtres de catégorie pour desktop
            const desktopGenderFilters = document.getElementById('desktop-gender-filters');
            desktopGenderFilters.innerHTML = '';
            
            categories.forEach(category => {
                const categoryValue = category.toLowerCase().replace(/\s+/g, '-');
                const checkbox = document.createElement('label');
                checkbox.className = 'filter-checkbox';
                checkbox.innerHTML = `
                    <input type="checkbox" name="gender" value="${categoryValue}">
                    <span>${category}</span>
                `;
                desktopGenderFilters.appendChild(checkbox);
            });
            
            // Générer les filtres de catégorie pour mobile
            const mobileGenderFilters = document.getElementById('mobile-gender-filters');
            mobileGenderFilters.innerHTML = '';
            
            categories.forEach(category => {
                const categoryValue = category.toLowerCase().replace(/\s+/g, '-');
                const checkbox = document.createElement('label');
                checkbox.className = 'filter-checkbox';
                checkbox.innerHTML = `
                    <input type="checkbox" name="gender" value="${categoryValue}">
                    <span>${category}</span>
                `;
                mobileGenderFilters.appendChild(checkbox);
            });
            
            // Ajouter les écouteurs d'événements pour les nouveaux filtres
            addFilterEventListeners();
        }

        // Fonction pour ajouter les écouteurs d'événements pour les filtres
        function addFilterEventListeners() {
            // Écouteurs pour les filtres desktop (marques)
            document.querySelectorAll('.shop-filters input[name="brand"]').forEach(checkbox => {
                checkbox.addEventListener('change', function() {
                    if (this.checked) {
                        if (!currentFilters.brands.includes(this.value)) {
                            currentFilters.brands.push(this.value);
                        }
                    } else {
                        currentFilters.brands = currentFilters.brands.filter(brand => brand !== this.value);
                    }
                    applyFilters();
                });
            });
            
            // Écouteurs pour les filtres desktop (genres)
            document.querySelectorAll('.shop-filters input[name="gender"]').forEach(checkbox => {
                checkbox.addEventListener('change', function() {
                    if (this.checked) {
                        if (!currentFilters.genders.includes(this.value)) {
                            currentFilters.genders.push(this.value);
                        }
                    } else {
                        currentFilters.genders = currentFilters.genders.filter(gender => gender !== this.value);
                    }
                    applyFilters();
                });
            });
        }

        // Fonction pour afficher les produits filtrés
        function displayProducts(products) {
            productsGrid.innerHTML = '';
            
            if (products.length === 0) {
                productsGrid.innerHTML = '<div class="no-results">Aucun produit ne correspond à vos critères de filtrage.</div>';
                currentCountSpan.textContent = '0';
                totalCountSpan.textContent = allProducts.length;
                return;
            }
            
            products.forEach(product => {
                const formattedPrice = product.price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                
                // CORRECTION: Gérer les produits avec une seule image ou plusieurs images
                let productImage;
                if (product.images && product.images.length > 0) {
                    productImage = product.images[0];
                } else if (product.image) {
                    productImage = product.image;
                } else {
                    productImage = 'https://via.placeholder.com/280x280?text=Image+Manquante';
                }
                
                const productCard = document.createElement('div');
                productCard.className = 'product-card';
                productCard.setAttribute('data-product-id', product.id);
                productCard.innerHTML = `
                    <div class="product-image-container">
                        <img src="${productImage}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/280x280?text=Image+Manquante'">
                        <div class="product-actions">
                            <span class="action-icon quickview-icon" data-action="quickview" data-product-id="${product.id}"><i class="fa-solid fa-eye"></i></span>
                            <span class="action-icon wishlist-icon" data-action="wishlist" data-product-id="${product.id}"><i class="fa-regular fa-heart"></i></span>
                        </div>
                    </div>
                    <div class="product-details">
                        <p class="name">${product.name}</p>
                        <p class="brand">${product.brand} - ${product.category}</p>
                        <p class="price">${formattedPrice} <span class="currency">د.ج</span></p>
                    </div>
                    <button class="command-button add-to-cart" data-product-id="${product.id}" data-product-name="${product.name}" data-product-price="${product.price}" data-product-image="${productImage}">AJOUTER AU PANIER</button>
                `;
                productsGrid.appendChild(productCard);
            });
            
            currentCountSpan.textContent = products.length;
            totalCountSpan.textContent = allProducts.length;
            
            initializeProductEventListeners();
            updateWishlistIcons();
        }

        // Fonction pour appliquer les filtres
        function applyFilters() {
            filteredProducts = allProducts.filter(product => {
                // Filtrer par prix
                if (product.price < currentFilters.priceMin || product.price > currentFilters.priceMax) {
                    return false;
                }
                
                // Filtrer par marque
                if (currentFilters.brands.length > 0) {
                    const productBrandValue = product.brand.toLowerCase().replace(/\s+/g, '-');
                    if (!currentFilters.brands.includes(productBrandValue)) {
                        return false;
                    }
                }
                
                // Filtrer par genre
                if (currentFilters.genders.length > 0) {
                    const productCategoryValue = product.category.toLowerCase().replace(/\s+/g, '-');
                    if (!currentFilters.genders.includes(productCategoryValue)) {
                        return false;
                    }
                }
                
                return true;
            });
            
            displayProducts(filteredProducts);
            updateActiveFilters();
        }

        // Fonction pour mettre à jour l'affichage des filtres actifs
        function updateActiveFilters() {
            activeFiltersContainer.innerHTML = '';
            
            // Ajouter les filtres de prix
            if (currentFilters.priceMin > 0 || currentFilters.priceMax < 100000) {
                const priceFilter = document.createElement('div');
                priceFilter.className = 'active-filter-tag';
                priceFilter.innerHTML = `Prix: ${currentFilters.priceMin} - ${currentFilters.priceMax} <i class="fas fa-times" data-filter-type="price"></i>`;
                activeFiltersContainer.appendChild(priceFilter);
            }
            
            // Ajouter les filtres de marque
            currentFilters.brands.forEach(brandValue => {
                const brandFilter = document.createElement('div');
                brandFilter.className = 'active-filter-tag';
                // Trouver le nom de la marque correspondant à la valeur
                const brandName = allProducts.find(p => p.brand.toLowerCase().replace(/\s+/g, '-') === brandValue)?.brand || brandValue;
                brandFilter.innerHTML = `${brandName} <i class="fas fa-times" data-filter-type="brand" data-value="${brandValue}"></i>`;
                activeFiltersContainer.appendChild(brandFilter);
            });
            
            // Ajouter les filtres de genre
            currentFilters.genders.forEach(categoryValue => {
                const genderFilter = document.createElement('div');
                genderFilter.className = 'active-filter-tag';
                // Trouver le nom de la catégorie correspondant à la valeur
                const categoryName = allProducts.find(p => p.category.toLowerCase().replace(/\s+/g, '-') === categoryValue)?.category || categoryValue;
                genderFilter.innerHTML = `${categoryName} <i class="fas fa-times" data-filter-type="gender" data-value="${categoryValue}"></i>`;
                activeFiltersContainer.appendChild(genderFilter);
            });
            
            // Ajouter les écouteurs d'événements pour les boutons de suppression de filtre
            document.querySelectorAll('.active-filter-tag i').forEach(icon => {
                icon.addEventListener('click', removeFilter);
            });
        }

        // Fonction pour supprimer un filtre
        function removeFilter(e) {
            const filterType = e.target.getAttribute('data-filter-type');
            
            if (filterType === 'price') {
                currentFilters.priceMin = 0;
                currentFilters.priceMax = 100000;
                document.querySelector('.desktop-price-min').value = 0;
                document.querySelector('.desktop-price-max').value = 100000;
                document.querySelector('.mobile-price-min').value = 0;
                document.querySelector('.mobile-price-max').value = 100000;
            } else if (filterType === 'brand') {
                const value = e.target.getAttribute('data-value');
                currentFilters.brands = currentFilters.brands.filter(brand => brand !== value);
                document.querySelector(`input[name="brand"][value="${value}"]`).checked = false;
            } else if (filterType === 'gender') {
                const value = e.target.getAttribute('data-value');
                currentFilters.genders = currentFilters.genders.filter(gender => gender !== value);
                document.querySelector(`input[name="gender"][value="${value}"]`).checked = false;
            }
            
            applyFilters();
        }

        // Fonction pour réinitialiser tous les filtres
        function resetAllFilters() {
            currentFilters = {
                priceMin: 0,
                priceMax: 100000,
                brands: [],
                genders: []
            };
            
            // Réinitialiser les inputs
            document.querySelectorAll('.price-input').forEach(input => {
                if (input.classList.contains('desktop-price-min') || input.classList.contains('mobile-price-min')) {
                    input.value = 0;
                } else {
                    input.value = 100000;
                }
            });
            
            document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                checkbox.checked = false;
            });
            
            applyFilters();
        }

        // Fonction pour initialiser les écouteurs d'événements pour les produits
        function initializeProductEventListeners() {
            // Écouteurs pour les boutons wishlist
            document.querySelectorAll('.wishlist-icon').forEach(button => {
                button.addEventListener('click', addToWishlist);
            });
            
            // Écouteurs pour les boutons d'ajout au panier
            document.querySelectorAll('.add-to-cart').forEach(button => {
                button.addEventListener('click', addToCart);
            });
            
            // Écouteurs pour les icônes quickview
            document.querySelectorAll('.quickview-icon').forEach(icon => {
                icon.addEventListener('click', handleQuickViewClick);
            });
        }
        
        function handleQuickViewClick(e) {
            e.stopPropagation();
            const productId = this.getAttribute('data-product-id');
            openQuickViewModal(productId);
        }

        // Fonction pour ouvrir le modal quickview
// Fonction pour ouvrir le modal quickview
async function openQuickViewModal(productId) {
    try {
        const doc = await productsRef.doc(productId).get();
        if (doc.exists) {
            const product = doc.data();
            document.getElementById('modal-product-name').textContent = product.name;
            document.getElementById('modal-product-price').textContent = product.price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            document.getElementById('modal-product-category').textContent = `${product.brand} - ${product.category}`;
            document.getElementById('modal-product-description').textContent = product.description || 'Aucune description disponible.';
            
            // CORRECTION: Gérer les produits avec une seule image ou plusieurs images
            let productImages;
            if (product.images && product.images.length > 0) {
                productImages = product.images;
            } else if (product.image) {
                productImages = [product.image];
            } else {
                productImages = ['https://via.placeholder.com/350x350?text=Image+Manquante'];
            }
            
            // Stocker l'ID du produit actuel et les données complètes
            currentProductId = productId;
            
            // Stocker temporairement le produit pour la redirection
            window.currentQuickViewProduct = {
                id: productId,
                ...product
            };
            
            // Afficher le carrousel d'images
            setupImageCarousel(productImages, productId);
            
            quickViewModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            showNotification('Produit non trouvé', 'error');
        }
    } catch (error) {
        console.error('Erreur lors de la récupération du produit:', error);
        showNotification('Erreur lors de l\'affichage du produit', 'error');
    }
}

        // Fonction pour configurer le carrousel d'images
        function setupImageCarousel(images, productId) {
            const mainImage = document.getElementById('modal-product-image');
            const thumbnailsContainer = document.getElementById('carousel-thumbnails');
            const prevBtn = document.querySelector('.carousel-prev');
            const nextBtn = document.querySelector('.carousel-next');
            
            // Vider les miniatures existantes
            thumbnailsContainer.innerHTML = '';
            
            // Si pas d'images, afficher une image par défaut
            if (!images || images.length === 0) {
                mainImage.src = 'https://via.placeholder.com/350x350?text=Image+Manquante';
                thumbnailsContainer.innerHTML = '<div class="no-images">Aucune image disponible</div>';
                prevBtn.style.display = 'none';
                nextBtn.style.display = 'none';
                return;
            }
            
            let currentImageIndex = 0;
            
            // Afficher la première image
            mainImage.src = images[0];
            
            // Créer les miniatures
            images.forEach((image, index) => {
                const thumbnail = document.createElement('div');
                thumbnail.className = `thumbnail ${index === 0 ? 'active' : ''}`;
                thumbnail.innerHTML = `<img src="${image}" alt="Miniature ${index + 1}" onerror="this.src='https://via.placeholder.com/60x60?text=Error'">`;
                
                thumbnail.addEventListener('click', () => {
                    // Mettre à jour l'image principale
                    mainImage.src = image;
                    currentImageIndex = index;
                    
                    // Mettre à jour les miniatures actives
                    document.querySelectorAll('.thumbnail').forEach(thumb => thumb.classList.remove('active'));
                    thumbnail.classList.add('active');
                });
                
                thumbnailsContainer.appendChild(thumbnail);
            });
            
            // Gérer le bouton précédent
            prevBtn.onclick = () => {
                currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
                updateCarousel();
            };
            
            // Gérer le bouton suivant
            nextBtn.onclick = () => {
                currentImageIndex = (currentImageIndex + 1) % images.length;
                updateCarousel();
            };
            
            // Fonction pour mettre à jour le carrousel
            function updateCarousel() {
                mainImage.src = images[currentImageIndex];
                
                // Mettre à jour les miniatures actives
                document.querySelectorAll('.thumbnail').forEach((thumb, index) => {
                    thumb.classList.toggle('active', index === currentImageIndex);
                });
            }
            
            // Afficher/masquer les boutons de navigation selon le nombre d'images
            if (images.length <= 1) {
                prevBtn.style.display = 'none';
                nextBtn.style.display = 'none';
            } else {
                prevBtn.style.display = 'flex';
                nextBtn.style.display = 'flex';
            }
            
            // Ajouter un indicateur du nombre d'images
            const existingCounter = document.querySelector('.image-counter');
            if (existingCounter) {
                existingCounter.remove();
            }
            
            if (images.length > 1) {
                const imageCounter = document.createElement('div');
                imageCounter.className = 'image-counter';
                imageCounter.textContent = `${currentImageIndex + 1} / ${images.length}`;
                document.querySelector('.main-image-container').appendChild(imageCounter);
                
                // Mettre à jour le compteur quand on change d'image
                const updateCounter = () => {
                    imageCounter.textContent = `${currentImageIndex + 1} / ${images.length}`;
                };
                
                // Redéfinir les événements pour inclure la mise à jour du compteur
                const originalPrev = prevBtn.onclick;
                const originalNext = nextBtn.onclick;
                
                prevBtn.onclick = () => {
                    originalPrev();
                    updateCounter();
                };
                
                nextBtn.onclick = () => {
                    originalNext();
                    updateCounter();
                };
                
                // Mettre à jour aussi pour les clics sur miniatures
                document.querySelectorAll('.thumbnail').forEach((thumb, index) => {
                    const originalClick = thumb.onclick;
                    thumb.onclick = () => {
                        originalClick();
                        currentImageIndex = index;
                        updateCounter();
                    };
                });
            }
        }

        // === FONCTIONS POUR LA WISHLIST ===
        
        // Fonction pour mettre à jour l'affichage de la wishlist
        function updateWishlistDisplay() {
            const wishlistContent = document.getElementById('wishlist-content');
            const wishlistCount = document.getElementById('wishlist-count');
            const mobileWishlistCount = document.getElementById('mobile-wishlist-count');
            
            wishlistContent.innerHTML = '';
            
            if (wishlist.length === 0) {
                wishlistContent.innerHTML = '<div class="wishlist-empty"><i class="far fa-heart" style="font-size: 48px; margin-bottom: 15px;"></i><p>Votre wishlist est vide</p></div>';
                wishlistCount.textContent = '0';
                mobileWishlistCount.textContent = '0';
            } else {
                wishlist.forEach(item => {
                    const wishlistItem = document.createElement('div');
                    wishlistItem.className = 'wishlist-item';
                    wishlistItem.innerHTML = `
                        <img src="${item.image}" alt="${item.name}" class="wishlist-item-image">
                        <div class="wishlist-item-details">
                            <div class="wishlist-item-name">${item.name}</div>
                            <div class="wishlist-item-price">${item.price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} د.ج</div>
                            <div class="wishlist-item-actions">
                                <button class="wishlist-add-to-cart add-to-cart-from-wishlist" data-id="${item.id}" data-name="${item.name}" data-price="${item.price}" data-image="${item.image}">AJOUTER AU PANIER</button>
                                <button class="wishlist-item-remove remove-from-wishlist" data-id="${item.id}"><i class="fas fa-trash"></i> Supprimer</button>
                            </div>
                        </div>
                    `;
                    wishlistContent.appendChild(wishlistItem);
                });
                
                wishlistCount.textContent = wishlist.length;
                mobileWishlistCount.textContent = wishlist.length;
                
                // Ajouter les écouteurs d'événements pour les nouveaux éléments
                document.querySelectorAll('.remove-from-wishlist').forEach(btn => {
                    btn.addEventListener('click', removeFromWishlist);
                });
                
                document.querySelectorAll('.add-to-cart-from-wishlist').forEach(btn => {
                    btn.addEventListener('click', addToCartFromWishlist);
                });
            }
            
            // Sauvegarder la wishlist dans le localStorage
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
        }

        // Fonction pour ouvrir la wishlist
        function openWishlist() {
            document.getElementById('wishlist-sidebar').classList.add('active');
            document.getElementById('wishlist-overlay').classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        // Fonction pour fermer la wishlist
        function closeWishlist() {
            document.getElementById('wishlist-sidebar').classList.remove('active');
            document.getElementById('wishlist-overlay').classList.remove('active');
            document.body.style.overflow = '';
        }

        // Fonction pour ajouter un produit à la wishlist
        function addToWishlist(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const button = e.currentTarget;
            const productCard = button.closest('.product-card');
            const productId = productCard.getAttribute('data-product-id');
            const productName = productCard.querySelector('.name').textContent;
            const productPriceText = productCard.querySelector('.price').textContent;
            const productPrice = parseFloat(productPriceText.replace(/[^\d,]/g, '').replace(',', '.'));
            
            // CORRECTION: Récupérer l'image depuis l'attribut data
            const addToCartButton = productCard.querySelector('.add-to-cart');
            const productImage = addToCartButton.getAttribute('data-product-image');
            
            // Vérifier si le produit est déjà dans la wishlist
            const existingItem = wishlist.find(item => item.id === productId);
            
            if (!existingItem) {
                // Ajouter le produit à la wishlist
                wishlist.push({
                    id: productId,
                    name: productName,
                    price: productPrice,
                    image: productImage
                });
                
                // Mettre à jour l'icône du cœur
                button.innerHTML = '<i class="fa-solid fa-heart"></i>';
                button.classList.add('active');
                
                // Afficher une notification
                showNotification('Produit ajouté à la wishlist');
            } else {
                // Retirer le produit de la wishlist
                wishlist = wishlist.filter(item => item.id !== productId);
                
                // Mettre à jour l'icône du cœur
                button.innerHTML = '<i class="fa-regular fa-heart"></i>';
                button.classList.remove('active');
                
                // Afficher une notification
                showNotification('Produit retiré de la wishlist');
            }
            
            // Mettre à jour l'affichage de la wishlist
            updateWishlistDisplay();
        }

        // Fonction pour supprimer un produit de la wishlist
        function removeFromWishlist(e) {
            const productId = e.currentTarget.getAttribute('data-id');
            wishlist = wishlist.filter(item => item.id !== productId);
            updateWishlistDisplay();
            showNotification('Produit retiré de la wishlist');
        }

        // Fonction pour ajouter au panier depuis la wishlist
        function addToCartFromWishlist(e) {
            const productId = e.currentTarget.getAttribute('data-id');
            const productName = e.currentTarget.getAttribute('data-name');
            const productPrice = parseFloat(e.currentTarget.getAttribute('data-price'));
            const productImage = e.currentTarget.getAttribute('data-image');
            
            // Ajouter au panier
            addToCartFunction(productId, productName, productPrice, productImage);
            
            // Afficher une notification
            showNotification('Produit ajouté au panier');
            
            // Fermer la wishlist
            closeWishlist();
        }

        // Fonction pour mettre à jour les icônes de wishlist dans les produits
        function updateWishlistIcons() {
            const productCards = document.querySelectorAll('.product-card');
            productCards.forEach(card => {
                const productId = card.getAttribute('data-product-id');
                const wishlistBtn = card.querySelector('.wishlist-icon');
                const isInWishlist = wishlist.find(item => item.id === productId);
                
                if (isInWishlist) {
                    wishlistBtn.innerHTML = '<i class="fa-solid fa-heart"></i>';
                    wishlistBtn.classList.add('active');
                } else {
                    wishlistBtn.innerHTML = '<i class="fa-regular fa-heart"></i>';
                    wishlistBtn.classList.remove('active');
                }
            });
        }

        // === FONCTIONS POUR LE PANIER ===
        
        // Fonction pour mettre à jour l'affichage du panier
        function updateCartDisplay() {
            const cartContent = document.getElementById('cart-content');
            const cartCount = document.getElementById('cart-count');
            const mobileCartCount = document.getElementById('mobile-cart-count');
            const cartTotal = document.getElementById('cart-total');
            
            // Vider le contenu du panier
            cartContent.innerHTML = '';
            
            if (cart.length === 0) {
                // Panier vide
                cartContent.innerHTML = `
                    <div class="cart-empty">
                        <i class="fas fa-shopping-bag" style="font-size: 48px; margin-bottom: 15px;"></i>
                        <p>Votre panier est vide</p>
                    </div>
                `;
                cartCount.textContent = '0';
                mobileCartCount.textContent = '0';
                cartTotal.textContent = '0,00 د.ج';
            } else {
                // Panier avec des articles
                let total = 0;
                let itemCount = 0;
                
                cart.forEach(item => {
                    const cartItem = document.createElement('div');
                    cartItem.className = 'cart-item';
                    cartItem.innerHTML = `
                        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                        <div class="cart-item-details">
                            <div class="cart-item-name">${item.name}</div>
                            <div class="cart-item-price">${item.price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} د.ج</div>
                            <div class="cart-item-quantity">
                                <button class="quantity-btn decrease-qty" data-id="${item.id}">-</button>
                                <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
                                <button class="quantity-btn increase-qty" data-id="${item.id}">+</button>
                                <button class="cart-item-remove remove-item" data-id="${item.id}">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    `;
                    cartContent.appendChild(cartItem);
                    
                    total += item.price * item.quantity;
                    itemCount += item.quantity;
                });
                
                cartCount.textContent = itemCount;
                mobileCartCount.textContent = itemCount;
                cartTotal.textContent = total.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' د.ج';
                
                // Ajouter les écouteurs d'événements pour les nouveaux éléments
                document.querySelectorAll('.decrease-qty').forEach(btn => {
                    btn.addEventListener('click', decreaseQuantity);
                });
                
                document.querySelectorAll('.increase-qty').forEach(btn => {
                    btn.addEventListener('click', increaseQuantity);
                });
                
                document.querySelectorAll('.quantity-input').forEach(input => {
                    input.addEventListener('change', updateQuantity);
                });
                
                document.querySelectorAll('.remove-item').forEach(btn => {
                    btn.addEventListener('click', removeFromCart);
                });
            }
            
            // Sauvegarder le panier dans le localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
        }

        // Fonction pour ouvrir le panier
        function openCart() {
            document.getElementById('cart-sidebar').classList.add('active');
            document.getElementById('cart-overlay').classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        // Fonction pour fermer le panier
        function closeCart() {
            document.getElementById('cart-sidebar').classList.remove('active');
            document.getElementById('cart-overlay').classList.remove('active');
            document.body.style.overflow = '';
        }

        // Fonction pour ajouter un produit au panier
        function addToCartFunction(productId, productName, productPrice, productImage) {
            // Vérifier si le produit est déjà dans le panier
            const existingItem = cart.find(item => item.id === productId);
            
            if (existingItem) {
                // Si le produit est déjà dans le panier, augmenter la quantité
                existingItem.quantity++;
            } else {
                // Sinon, ajouter le produit au panier
                cart.push({
                    id: productId,
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    quantity: 1
                });
            }
            
            // Mettre à jour l'affichage du panier
            updateCartDisplay();
        }

        // Fonction pour ajouter un produit au panier (clic sur le bouton)
        function addToCart(e) {
            const button = e.currentTarget;
            const productId = button.getAttribute('data-product-id');
            const productName = button.getAttribute('data-product-name');
            const productPrice = parseFloat(button.getAttribute('data-product-price'));
            const productImage = button.getAttribute('data-product-image');
            
            addToCartFunction(productId, productName, productPrice, productImage);
            showNotification('Produit ajouté au panier');
        }

        // Fonction pour augmenter la quantité d'un produit
        function increaseQuantity(e) {
            const productId = e.currentTarget.getAttribute('data-id');
            const item = cart.find(item => item.id === productId);
            
            if (item) {
                item.quantity++;
                updateCartDisplay();
            }
        }

        // Fonction pour diminuer la quantité d'un produit
        function decreaseQuantity(e) {
            const productId = e.currentTarget.getAttribute('data-id');
            const item = cart.find(item => item.id === productId);
            
            if (item && item.quantity > 1) {
                item.quantity--;
                updateCartDisplay();
            }
        }

        // Fonction pour mettre à jour la quantité d'un produit
        function updateQuantity(e) {
            const productId = e.currentTarget.getAttribute('data-id');
            const newQuantity = parseInt(e.currentTarget.value);
            const item = cart.find(item => item.id === productId);
            
            if (item && newQuantity > 0) {
                item.quantity = newQuantity;
                updateCartDisplay();
            }
        }

        // Fonction pour supprimer un produit du panier
        function removeFromCart(e) {
            const productId = e.currentTarget.getAttribute('data-id');
            cart = cart.filter(item => item.id !== productId);
            updateCartDisplay();
            showNotification('Produit retiré du panier');
        }

        // === FONCTIONS POUR LES FILTRES & MODAL ===
        
        // Fonction pour fermer le modal quickview
        function closeQuickViewModal() {
            quickViewModal.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        // AJOUT: Fonction pour rediriger vers la page de détails du produit
// AJOUT: Fonction pour rediriger vers la page de détails du produit
function viewProductDetails() {
    if (currentProductId) {
        // Stocker les données du produit dans localStorage
        const product = allProducts.find(p => p.id === currentProductId);
        if (product) {
            localStorage.setItem('selectedProduct', JSON.stringify(product));
            // Rediriger vers la page cart.html
            window.location.href = 'cart.html';
        }
    } else {
        showNotification('Erreur: ID du produit non disponible', 'error');
    }
}
        // === INITIALISATION AU CHARGEMENT DE LA PAGE ===
        document.addEventListener('DOMContentLoaded', function() {
            // Charger les produits depuis Firebase
            loadProductsFromFirebase();
            
            // Initialiser l'affichage du panier et de la wishlist
            updateCartDisplay();
            updateWishlistDisplay();
            
            // Écouteurs d'événements pour le panier
            document.getElementById('cart-icon').addEventListener('click', openCart);
            document.getElementById('mobile-cart-icon').addEventListener('click', openCart);
            document.getElementById('close-cart').addEventListener('click', closeCart);
            document.getElementById('cart-overlay').addEventListener('click', closeCart);
            
            // Écouteurs d'événements pour la wishlist
            document.getElementById('wishlist-icon').addEventListener('click', openWishlist);
            document.getElementById('mobile-wishlist-icon').addEventListener('click', openWishlist);
            document.getElementById('mobile-bottom-wishlist').addEventListener('click', openWishlist);
            document.getElementById('close-wishlist').addEventListener('click', closeWishlist);
            document.getElementById('wishlist-overlay').addEventListener('click', closeWishlist);
            
            // Écouteurs d'événements pour les filtres desktop
            document.getElementById('applyPriceFilter').addEventListener('click', function() {
                currentFilters.priceMin = parseFloat(document.querySelector('.desktop-price-min').value) || 0;
                currentFilters.priceMax = parseFloat(document.querySelector('.desktop-price-max').value) || 100000;
                applyFilters();
            });
            
            // Écouteurs d'événements pour les filtres mobiles
            document.getElementById('mobileFilterToggle').addEventListener('click', function() {
                document.getElementById('mobileFiltersMenu').classList.add('active');
                document.getElementById('filtersOverlay').classList.add('active');
                document.body.style.overflow = 'hidden';
            });
            
            function closeMobileFilters() {
                document.getElementById('mobileFiltersMenu').classList.remove('active');
                document.getElementById('filtersOverlay').classList.remove('active');
                document.body.style.overflow = '';
            }
            
            document.getElementById('closeFilters').addEventListener('click', closeMobileFilters);
            document.getElementById('filtersOverlay').addEventListener('click', closeMobileFilters);
            
            document.getElementById('mobileFilterApply').addEventListener('click', function() {
                // Appliquer les filtres de prix
                currentFilters.priceMin = parseFloat(document.querySelector('.mobile-price-min').value) || 0;
                currentFilters.priceMax = parseFloat(document.querySelector('.mobile-price-max').value) || 100000;
                
                // Appliquer les filtres de marque
                currentFilters.brands = [];
                document.querySelectorAll('.mobile-filters-menu input[name="brand"]:checked').forEach(checkbox => {
                    currentFilters.brands.push(checkbox.value);
                });
                
                // Appliquer les filtres de genre
                currentFilters.genders = [];
                document.querySelectorAll('.mobile-filters-menu input[name="gender"]:checked').forEach(checkbox => {
                    currentFilters.genders.push(checkbox.value);
                });
                
                // Synchroniser avec les filtres desktop
                document.querySelector('.desktop-price-min').value = currentFilters.priceMin;
                document.querySelector('.desktop-price-max').value = currentFilters.priceMax;
                
                document.querySelectorAll('.shop-filters input[name="brand"]').forEach(checkbox => {
                    checkbox.checked = currentFilters.brands.includes(checkbox.value);
                });
                
                document.querySelectorAll('.shop-filters input[name="gender"]').forEach(checkbox => {
                    checkbox.checked = currentFilters.genders.includes(checkbox.value);
                });
                
                applyFilters();
                closeMobileFilters();
            });
            
            document.getElementById('mobileFilterReset').addEventListener('click', function() {
                resetAllFilters();
                closeMobileFilters();
            });
            
            // Écouteur pour le bouton de réinitialisation des filtres
            document.getElementById('resetFilters').addEventListener('click', resetAllFilters);
            
            // Écouteurs d'événements pour le modal quickview
            document.querySelector('.close-modal-btn').addEventListener('click', closeQuickViewModal);
            quickViewModal.addEventListener('click', function(e) {
                if (e.target === quickViewModal) {
                    closeQuickViewModal();
                }
            });
            
            // AJOUT: Écouteur d'événements pour le bouton "VIEW DETAILS"
// AJOUT: Écouteur d'événements pour le bouton "VIEW DETAILS"
document.querySelector('.view-details-btn').addEventListener('click', viewProductDetails);

            // Écouteurs d'événements pour les boutons plus et moins pour la quantité
            const qtyMinus = document.getElementById('qty-minus');
            const qtyPlus = document.getElementById('qty-plus');
            const qtyInput = document.getElementById('qty-input');
            
            if (qtyMinus && qtyPlus && qtyInput) {
                qtyMinus.addEventListener('click', function() {
                    if (qtyInput.value > 1) {
                        qtyInput.value = parseInt(qtyInput.value) - 1;
                    }
                });
                
                qtyPlus.addEventListener('click', function() {
                    if (qtyInput.value < 100) {
                        qtyInput.value = parseInt(qtyInput.value) + 1;
                    }
                });
            }
        });