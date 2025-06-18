import Alpine from "alpinejs";
import persist from '@alpinejs/persist'
 
Alpine.plugin(persist)

const W_TILE = 9.7
const W_JOINT = .3

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

export default class App {

	constructor () {

		window.Alpine = Alpine

		document.addEventListener('alpine:init', () => {

			Alpine.data('app', function () {

				return {

					width: this.$persist(265),
					height: this.$persist(249),
					align: this.$persist('ltr'),
					columns: this.$persist(0),
					rows: this.$persist(0),
					templateColumns: this.$persist('repeat(26, 1fr)'),
					templateRows: this.$persist('repeat(24, 1fr)'),
					aspectRatio: this.$persist('1.064257028'),

					collection: this.$persist({

						tile16900: {
							active: true,
							distribution: 4,
						},
						tile16905: {
							active: true,
							distribution: 4,
						},
						tile16906: {
							active: true,
							distribution: 4,
						},
						tile16901ne: {
							active: true,
							distribution: 1,
						},
						tile16901se: {
							active: true,
							distribution: 1,
						},
						tile16901sw: {
							active: true,
							distribution: 1,
						},
						tile16901nw: {
							active: true,
							distribution: 1,
						},

					}),

					distribution: function () {
						let total = 0;
						for ( const property in this.collection ) {
							const tile = this.collection[property]
							if ( tile.active ) total += parseInt(tile.distribution)
						}
						return total;
					},

					distributionString: function (tile) {
						if ( !tile.active ) return '';
						const total = this.distribution()
						const pct = Math.round(tile.distribution / total * 10000) / 100

						return `${tile.distribution} / ${total} (${pct}%)`
					},

					calculateGrid: function () {
						this.columns = Math.ceil( this.width / ( W_TILE + W_JOINT ) )
						this.rows = Math.floor( this.height / ( W_TILE + W_JOINT ) )
						this.templateColumns = 'repeat(' + this.columns + ', 1fr)'
						this.templateRows = 'repeat(' + this.rows + ', 1fr)'
					},
					generateTiles: function () {
						this.$refs.tiles.replaceChildren()
						const q = this.columns * this.rows

						for( let i = 0; i < q; i++ ) {
							const d = document.createElement('div')
							this.$refs.tiles.append(d)
						}
					},
					shuffleTiles: function () {
						const a = Array.from(this.$refs.tiles.children)
						shuffleArray(a)
						a.forEach( $e => $refs.tiles.append($e) )
					},
					distribute: function () {
						let classes = []
						for ( const tilename in this.collection ) {
							const tile = this.collection[tilename]
							if ( tile.active ) {
								const n = Math.ceil( tile.distribution / this.distribution() * this.$refs.tiles.childElementCount )
								for ( let i = 0; i < n; i++ ) {
									classes.push(tilename)
								}
							}
						}
						shuffleArray(classes)

						Array.from(this.$refs.tiles.children).forEach( $tile => {
							$tile.className = ''
							$tile.classList.add( classes.pop() )
						})

					},

					resize: function () {
						this.aspectRatio = this.width / this.height
						this.update()
					},

					update: function () {
						this.calculateGrid()
						this.generateTiles()
						this.distribute()
					}

				}

			})

		})

		Alpine.start()

	}

}
