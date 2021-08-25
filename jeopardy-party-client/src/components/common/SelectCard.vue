<script lang="ts">
import Vue, { VNode } from 'vue';

interface Option {
    value: any;
    selected: boolean;
    vnode: VNode;
}

export default Vue.extend({
  name: 'SelectCard',
  props: {
	  value: {
		  type: [Array],
		  default: () => [],
	  },
  },
  data: function () {
	  return {
		  model: [] as any[],
	  };
  },
  render: function(h): VNode {
	  const children = this.options as Option[];
	  const options = (children || []).map((child) => {
		  return h('button', { on: { click: this.handleClick(child) }, class: 'half-margin' }, [child.vnode]);
	  });
	  return h('div', { attrs: { class: 'flex flex-center' } }, options);
  },
  computed: {
      options: function () {
        const slots = this.$slots || { };
        const options = (slots.default || []).map(s => {
            const slot = s || { };
            const component = slot.componentInstance || { };
            const val = (component as any).value;

            const option = {
                vnode: slot,
                value: val,
                selected: false,
            };

            Vue.set(option, 'selected', false); // for reactivity

            return option;
        });

        return options;
      }
  },
  methods: {
	  handleClick: function (option: Option) {
		  return () => {
              option.selected = !option.selected;

              this.model = (this.options as Option[]).map(o => o.value);
              this.$emit('input', this.model);
		  }
	  },
  },
});
</script>
