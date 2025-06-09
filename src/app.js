import Alpine from "alpinejs";

const W_TILE = 10
const W_JOINT = .25

export default class App {

	constructor () {

		window.Alpine = Alpine

		document.addEventListener('alpine:init', () => {

			Alpine.data('app', () => ({

				width: 265,
				height: 249,
				columns: 0,
				rows: 0,
				templateColumns: 'repeat(26, 1fr)',
				templateRows: 'repeat(24, 1fr)',
				aspectRatio: '1.064257028',

				calculateGrid: function () {
					this.columns = Math.ceil( this.width / ( W_TILE + W_JOINT ) )
					this.rows = Math.floor( this.height / ( W_TILE + W_JOINT ) )
					this.templateColumns = 'repeat(' + this.columns + ', 1fr)'
					this.templateRows = 'repeat(' + this.rows + ', 1fr)'
				},
				generateTiles: function () {
					this.$refs.tiles.replaceChildren()
					const q = this.columns * this.rows
					console.log(q)
					for( let i = 0; i < q; i++ ) {
						const d = document.createElement('div')
						d.classList.add('tile')
						this.$refs.tiles.append(d)
					}
				},

				resize: function () {
					this.aspectRatio = this.width / this.height
					this.update()
				},

				update: function () {
					this.calculateGrid()
					this.generateTiles()
				}

			}))

		})

		Alpine.start()

	}

}
