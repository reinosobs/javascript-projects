const DECISION_THRESHOLD = 80; 
    let isAnimating = false
    let pullDeltaX = 0 // distance card is moving


    function starDrag (event) {
        if(isAnimating) return

        const actualCard = event.target.closest('article')
        if(!actualCard) return

        const startX = event.pageX ?? event.touches[0].pageX

        document.addEventListener('mousemove', onMove)
        document.addEventListener('mouseup', onEnd)

        document.addEventListener('touchmove', onMove, {passive: true})
        document.addEventListener('touchend', onEnd, {passive: true})
        function onMove(event) {
            const currentX = event.pageX ?? event.touches[0].pageX

            pullDeltaX = currentX - startX

            if (pullDeltaX === 0 ) return

            isAnimating = true

            const deg = pullDeltaX / 14

            // apply the transformation to the card
            actualCard.style.transform = `translateX(${pullDeltaX}px) rotate(${deg}deg)`

            // change the cursor to grabbing
            actualCard.style.cursor = 'grabbing'
            const opacity = Math.abs(pullDeltaX) / 100
            const isRight = pullDeltaX > 0

            const choiceEl = isRight ? actualCard.querySelector('.choice.like') : actualCard.querySelector('.choice.nope')

            choiceEl.style.opacity = opacity
        }

        function onEnd(event) {
            document.removeEventListener('mousemove', onMove)
            document.removeEventListener('mouseup', onEnd)

            document.removeEventListener('touchmove', onMove)
            document.removeEventListener('touchend', onEnd)

            const decisionMade = Math.abs(pullDeltaX) >= DECISION_THRESHOLD

            if (decisionMade) {
                const goRight = pullDeltaX >= 0
                const goLeft = !goRight

                actualCard.classList.add(goRight ? 'go-right' : 'go-left')
                actualCard.addEventListener('transitionend', () => {
                    actualCard.remove()
                }, { once: true})
            }
            else 
            {
                actualCard.classList.add('reset')
                actualCard.classList.remove('go-right', 'go-left')
                actualCard.querySelectorAll('.choice').forEach(el =>
                    el.style.opacity = 0
                )
            }

            actualCard.addEventListener('transitionend', () => {
                actualCard.removeAttribute('style')
                actualCard.classList.remove('reset')

                pullDeltaX = 0
                isAnimating = false
            })
            
        }
    }

    

    document.addEventListener('mousedown', starDrag)
    document.addEventListener('touchstart', starDrag, {passive: true})