<template>
	<div>
		<input v-model="todo" @keydown.enter="addTodo"
			:class="$style.input" 
			placeholder="Add a new todo item" />

		<ul :class="$style.list">
			<li v-for="todo in todos" :key="todo.id"
				@click="toggleTodo(todo.id)"
				:class="[$style.todo, {[$style.done]: todo.status === 'completed'}]">

				<icon :class="$style.icon"
					:done="todo.status === 'completed'" />

				<span :class="$style.text">
					{{todo.text}}</span>
			</li>
		</ul>

		<div :class="$style.actions">
			<div v-if="anyTodos">
				{{activeTodos.length}} item<span v-if="activeTodos.length !== 1">s</span> left
			</div>
			<div v-if="anyTodos">
				<router-link :to="{name:'todos', params: {status: 'all'}}">All</router-link>
				<router-link :to="{name:'todos', params: {status: 'active'}}">Active</router-link>
				<router-link :to="{name:'todos', params: {status: 'completed'}}">Completed</router-link>
			</div>
			<div>
				<router-link :to="{name:'about'}">About</router-link>
			</div>
		</div>

	</div>
</template>

<script>

	import Icon from './todo-icon.vue';

	export default {
		name: 'Todos',
		components: { Icon },
		props: {
			status: {
				type: String,
				default: 'all'
			}
		},
		data() {
			return {
				todo: ''
			};
		},
		computed: {

			anyTodos() {
				return this.$store.state.todos.length > 0;
			},

			activeTodos() {
				return this.$store.state.todos.filter((todo) => {
					return todo.status === 'active';
				});
			},

			todos() {
				if (this.status === 'all') {
					return this.$store.state.todos;
				}
				
				// filter the todos
				return this.$store.state.todos.filter((todo) => {
					return todo.status === this.status;
				});
			}
		},
		methods: {
			
			addTodo(event) {
				this.$store.dispatch('addTodo', this.todo);
				this.todo = '';
			},

			toggleTodo(id) {
				this.$store.dispatch('toggleTodo', id);
			}
		}
	};
</script>


<style lang="stylus" module>
	@require("./todos");
</style>